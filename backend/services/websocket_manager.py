import asyncio
import json
from typing import Dict, List, Set, Optional
from datetime import datetime, timedelta
from fastapi import WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import uuid

from models.user import User, UserSession, Bid
from models.auction import AuctionRoom, PlayerAuction, AuctionEvent, BidAttempt, AuctionResult

class ConnectionManager:
    def __init__(self):
        # WebSocket connections: {user_id: websocket}
        self.active_connections: Dict[str, WebSocket] = {}
        # Room participants: {room_id: {user_id1, user_id2, ...}}
        self.room_participants: Dict[str, Set[str]] = {}
        # User sessions: {user_id: UserSession}
        self.user_sessions: Dict[str, UserSession] = {}
        # Active auctions: {room_id: PlayerAuction}
        self.active_auctions: Dict[str, PlayerAuction] = {}
        # Auction timers: {auction_id: asyncio.Task}
        self.auction_timers: Dict[str, asyncio.Task] = {}
        # Bid history: {auction_id: [Bid, ...]}
        self.bid_history: Dict[str, List[Bid]] = {}
        # User budgets: {user_id: remaining_budget}
        self.user_budgets: Dict[str, int] = {}

    async def connect(self, websocket: WebSocket, user_id: str, username: str):
        """Connect a user to the WebSocket"""
        await websocket.accept()
        
        # Store connection
        self.active_connections[user_id] = websocket
        
        # Create user session
        session = UserSession(
            user_id=user_id,
            session_id=f"session_{uuid.uuid4().hex[:8]}",
            socket_id=f"socket_{uuid.uuid4().hex[:8]}",
            is_online=True
        )
        self.user_sessions[user_id] = session
        
        # Initialize user budget if not exists
        if user_id not in self.user_budgets:
            self.user_budgets[user_id] = 100_000_000  # £100M default
        
        print(f"User {username} ({user_id}) connected")
        
        # Send initial connection confirmation
        await self.send_personal_message({
            "type": "connection_confirmed",
            "user_id": user_id,
            "username": username,
            "session_id": session.session_id,
            "budget": self.user_budgets[user_id],
            "timestamp": datetime.now().isoformat()
        }, user_id)

    async def disconnect(self, user_id: str):
        """Disconnect a user"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        
        if user_id in self.user_sessions:
            del self.user_sessions[user_id]
        
        # Remove from all rooms
        for room_id in list(self.room_participants.keys()):
            if user_id in self.room_participants[room_id]:
                await self.leave_room(user_id, room_id)
        
        print(f"User {user_id} disconnected")

    async def join_room(self, user_id: str, username: str, room_id: str):
        """Add user to auction room"""
        if room_id not in self.room_participants:
            self.room_participants[room_id] = set()
        
        self.room_participants[room_id].add(user_id)
        
        # Broadcast user joined event
        await self.broadcast_to_room({
            "type": "user_joined",
            "room_id": room_id,
            "user_id": user_id,
            "username": username,
            "participants_count": len(self.room_participants[room_id]),
            "timestamp": datetime.now().isoformat()
        }, room_id)
        
        # Send room state to new user
        await self.send_room_state(user_id, room_id)

    async def leave_room(self, user_id: str, room_id: str):
        """Remove user from auction room"""
        if room_id in self.room_participants and user_id in self.room_participants[room_id]:
            self.room_participants[room_id].remove(user_id)
            
            # Get username for broadcast
            username = self.user_sessions.get(user_id, {}).get("username", "Unknown")
            
            # Broadcast user left event
            await self.broadcast_to_room({
                "type": "user_left",
                "room_id": room_id,
                "user_id": user_id,
                "username": username,
                "participants_count": len(self.room_participants[room_id]),
                "timestamp": datetime.now().isoformat()
            }, room_id)
            
            # Clean up empty rooms
            if len(self.room_participants[room_id]) == 0:
                del self.room_participants[room_id]

    async def start_auction(self, room_id: str, player_data: dict):
        """Start a new player auction in a room"""
        auction = PlayerAuction(
            room_id=room_id,
            player_id=player_data["id"],
            player_name=player_data["name"],
            player_team=player_data["team"],
            player_position=player_data["position"],
            player_image=player_data["image"],
            player_stats=player_data.get("stats", {}),
            starting_bid=1_000_000,
            current_bid=1_000_000,
            status="active",
            started_at=datetime.now()
        )
        
        self.active_auctions[room_id] = auction
        self.bid_history[auction.id] = []
        
        # Start auction timer
        timer_task = asyncio.create_task(self.auction_timer(auction.id, room_id))
        self.auction_timers[auction.id] = timer_task
        
        # Broadcast auction started
        await self.broadcast_to_room({
            "type": "auction_started",
            "room_id": room_id,
            "auction": auction.dict(),
            "timestamp": datetime.now().isoformat()
        }, room_id)

    async def place_bid(self, user_id: str, username: str, room_id: str, bid_amount: int):
        """Process a bid attempt"""
        if room_id not in self.active_auctions:
            await self.send_personal_message({
                "type": "bid_error",
                "message": "No active auction in this room",
                "timestamp": datetime.now().isoformat()
            }, user_id)
            return False
        
        auction = self.active_auctions[room_id]
        user_budget = self.user_budgets.get(user_id, 0)
        
        # Validate bid
        if bid_amount < auction.minimum_next_bid:
            await self.send_personal_message({
                "type": "bid_error",
                "message": f"Minimum bid is £{auction.minimum_next_bid:,}",
                "timestamp": datetime.now().isoformat()
            }, user_id)
            return False
        
        if bid_amount > user_budget:
            await self.send_personal_message({
                "type": "bid_error",
                "message": f"Insufficient budget. You have £{user_budget:,} remaining",
                "timestamp": datetime.now().isoformat()
            }, user_id)
            return False
        
        # Process successful bid
        bid = Bid(
            auction_id=auction.id,
            player_id=auction.player_id,
            user_id=user_id,
            username=username,
            amount=bid_amount,
            is_winning=True
        )
        
        # Mark previous winning bid as no longer winning
        for prev_bid in self.bid_history[auction.id]:
            prev_bid.is_winning = False
        
        # Add new bid to history
        self.bid_history[auction.id].append(bid)
        
        # Update auction state
        auction.current_bid = bid_amount
        auction.minimum_next_bid = bid_amount + auction.bid_increment
        auction.current_winner = user_id
        auction.current_winner_username = username
        auction.total_bids += 1
        auction.last_bid_time = datetime.now()
        
        # Add user to participants if not already there
        if user_id not in auction.participants:
            auction.participants.append(user_id)
            auction.participant_usernames.append(username)
        
        # Extend timer if bid placed in last 30 seconds
        if auction.time_remaining < 30:
            auction.time_remaining = 30
        
        # Broadcast bid update
        await self.broadcast_to_room({
            "type": "bid_placed",
            "room_id": room_id,
            "auction_id": auction.id,
            "bid": bid.dict(),
            "auction_state": {
                "current_bid": auction.current_bid,
                "minimum_next_bid": auction.minimum_next_bid,
                "current_winner": auction.current_winner_username,
                "total_bids": auction.total_bids,
                "time_remaining": auction.time_remaining,
                "participants_count": len(auction.participants)
            },
            "timestamp": datetime.now().isoformat()
        }, room_id)
        
        return True

    async def auction_timer(self, auction_id: str, room_id: str):
        """Handle auction countdown timer"""
        try:
            while room_id in self.active_auctions:
                auction = self.active_auctions[room_id]
                
                if auction.time_remaining <= 0:
                    await self.end_auction(room_id)
                    break
                
                # Send timer update every 5 seconds, or every second in final 30 seconds
                update_interval = 1 if auction.time_remaining <= 30 else 5
                
                await self.broadcast_to_room({
                    "type": "timer_update",
                    "room_id": room_id,
                    "auction_id": auction.id,
                    "time_remaining": auction.time_remaining,
                    "timestamp": datetime.now().isoformat()
                }, room_id)
                
                await asyncio.sleep(update_interval)
                auction.time_remaining -= update_interval
                
        except asyncio.CancelledError:
            print(f"Auction timer cancelled for {auction_id}")

    async def end_auction(self, room_id: str):
        """End the current auction in a room"""
        if room_id not in self.active_auctions:
            return
        
        auction = self.active_auctions[room_id]
        auction.status = "sold" if auction.current_winner else "unsold"
        auction.ended_at = datetime.now()
        
        # Cancel timer
        if auction.id in self.auction_timers:
            self.auction_timers[auction.id].cancel()
            del self.auction_timers[auction.id]
        
        # Update winner's budget if there's a winner
        if auction.current_winner:
            self.user_budgets[auction.current_winner] -= auction.current_bid
        
        # Create auction result
        result = AuctionResult(
            auction_id=auction.id,
            player_id=auction.player_id,
            player_name=auction.player_name,
            winning_bid=auction.current_bid,
            winner_user_id=auction.current_winner,
            winner_username=auction.current_winner_username,
            total_bids=auction.total_bids,
            participants_count=len(auction.participants),
            auction_duration=300 - auction.time_remaining
        )
        
        # Broadcast auction ended
        await self.broadcast_to_room({
            "type": "auction_ended",
            "room_id": room_id,
            "auction_result": result.dict(),
            "bid_history": [bid.dict() for bid in self.bid_history.get(auction.id, [])],
            "timestamp": datetime.now().isoformat()
        }, room_id)
        
        # Clean up
        del self.active_auctions[room_id]
        if auction.id in self.bid_history:
            del self.bid_history[auction.id]

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
            except:
                # Connection closed, clean up
                await self.disconnect(user_id)

    async def broadcast_to_room(self, message: dict, room_id: str):
        """Broadcast message to all users in a room"""
        if room_id in self.room_participants:
            disconnected_users = []
            for user_id in self.room_participants[room_id]:
                if user_id in self.active_connections:
                    try:
                        await self.active_connections[user_id].send_text(json.dumps(message))
                    except:
                        disconnected_users.append(user_id)
            
            # Clean up disconnected users
            for user_id in disconnected_users:
                await self.disconnect(user_id)

    async def send_room_state(self, user_id: str, room_id: str):
        """Send current room state to a user"""
        room_state = {
            "type": "room_state",
            "room_id": room_id,
            "participants_count": len(self.room_participants.get(room_id, [])),
            "user_budget": self.user_budgets.get(user_id, 100_000_000),
            "timestamp": datetime.now().isoformat()
        }
        
        # Add current auction if active
        if room_id in self.active_auctions:
            auction = self.active_auctions[room_id]
            room_state["current_auction"] = auction.dict()
            room_state["bid_history"] = [bid.dict() for bid in self.bid_history.get(auction.id, [])]
        
        await self.send_personal_message(room_state, user_id)

# Global connection manager instance
manager = ConnectionManager()