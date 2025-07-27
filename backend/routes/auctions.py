from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
import json
from datetime import datetime
import uuid

from models.auction import AuctionRoom, PlayerAuction, AuctionEvent, BidAttempt, AuctionResult
from models.user import User, Bid
from services.websocket_manager import manager

router = APIRouter(prefix="/auctions", tags=["auctions"])

# Sample cricket players for auctions
CRICKET_PLAYERS = [
    {
        "id": "player-1",
        "name": "Virat Kohli",
        "team": "Royal Challengers Bangalore",
        "shortTeam": "RCB",
        "position": "Batsman",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        "stats": {
            "matches": 237,
            "runs": 7263,
            "average": 37.25,
            "strikeRate": 130.41
        },
        "rating": 95,
        "basePrice": 2_000_000
    },
    {
        "id": "player-2",
        "name": "MS Dhoni",
        "team": "Chennai Super Kings",
        "shortTeam": "CSK",
        "position": "Wicket-keeper",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        "stats": {
            "matches": 234,
            "runs": 4978,
            "average": 39.65,
            "strikeRate": 135.92
        },
        "rating": 92,
        "basePrice": 2_000_000
    },
    {
        "id": "player-3",
        "name": "Jasprit Bumrah",
        "team": "Mumbai Indians",
        "shortTeam": "MI",
        "position": "Bowler",
        "image": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        "stats": {
            "matches": 120,
            "wickets": 165,
            "average": 24.43,
            "economy": 7.39
        },
        "rating": 94,
        "basePrice": 1_500_000
    },
    {
        "id": "player-4",
        "name": "Andre Russell",
        "team": "Kolkata Knight Riders",
        "shortTeam": "KKR",
        "position": "All-rounder",
        "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        "stats": {
            "matches": 140,
            "runs": 2556,
            "average": 29.95,
            "strikeRate": 179.55
        },
        "rating": 89,
        "basePrice": 1_800_000
    },
    {
        "id": "player-5",
        "name": "David Warner",
        "team": "Delhi Capitals",
        "shortTeam": "DC",
        "position": "Batsman",
        "image": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        "stats": {
            "matches": 162,
            "runs": 6397,
            "average": 41.81,
            "strikeRate": 139.96
        },
        "rating": 87,
        "basePrice": 1_200_000
    }
]

# In-memory storage for demo (in production, use database)
auction_rooms: dict = {}

@router.get("/")
async def get_auctions():
    """Get list of available auction rooms"""
    return {
        "auctions": list(auction_rooms.values()),
        "total": len(auction_rooms),
        "timestamp": datetime.now().isoformat()
    }

@router.post("/rooms")
async def create_auction_room(
    name: str,
    description: str = "Cricket Player Auction",
    max_participants: int = 20,
    created_by: str = "system"
):
    """Create a new auction room"""
    room = AuctionRoom(
        name=name,
        description=description,
        max_participants=max_participants,
        created_by=created_by,
        auction_queue=[player["id"] for player in CRICKET_PLAYERS]  # Add all players to queue
    )
    
    auction_rooms[room.id] = room
    
    return {
        "success": True,
        "room": room.dict(),
        "message": f"Auction room '{name}' created successfully"
    }

@router.get("/rooms/{room_id}")
async def get_auction_room(room_id: str):
    """Get auction room details"""
    if room_id not in auction_rooms:
        raise HTTPException(status_code=404, detail="Auction room not found")
    
    room = auction_rooms[room_id]
    
    # Get current auction if active
    current_auction = None
    if room_id in manager.active_auctions:
        current_auction = manager.active_auctions[room_id].dict()
    
    return {
        "room": room.dict(),
        "current_auction": current_auction,
        "participants_online": len(manager.room_participants.get(room_id, [])),
        "timestamp": datetime.now().isoformat()
    }

@router.get("/players")
async def get_available_players():
    """Get list of cricket players available for auction"""
    return {
        "players": CRICKET_PLAYERS,
        "total": len(CRICKET_PLAYERS),
        "timestamp": datetime.now().isoformat()
    }

@router.get("/players/{player_id}")
async def get_player_details(player_id: str):
    """Get detailed information about a specific player"""
    player = next((p for p in CRICKET_PLAYERS if p["id"] == player_id), None)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    return {
        "player": player,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/rooms/{room_id}/start-auction")
async def start_next_auction(room_id: str, player_id: Optional[str] = None):
    """Start auction for next player in queue or specific player"""
    if room_id not in auction_rooms:
        raise HTTPException(status_code=404, detail="Auction room not found")
    
    room = auction_rooms[room_id]
    
    # Check if there's already an active auction
    if room_id in manager.active_auctions:
        return {
            "success": False,
            "message": "Auction already active in this room",
            "current_auction": manager.active_auctions[room_id].dict()
        }
    
    # Determine which player to auction
    if player_id:
        # Specific player requested
        player_data = next((p for p in CRICKET_PLAYERS if p["id"] == player_id), None)
        if not player_data:
            raise HTTPException(status_code=404, detail="Player not found")
    else:
        # Next player in queue
        if not room.auction_queue:
            return {
                "success": False,
                "message": "No more players in auction queue"
            }
        
        next_player_id = room.auction_queue[0]
        player_data = next((p for p in CRICKET_PLAYERS if p["id"] == next_player_id), None)
        
        if not player_data:
            # Remove invalid player from queue and try next
            room.auction_queue.pop(0)
            return await start_next_auction(room_id)
    
    # Start the auction
    await manager.start_auction(room_id, player_data)
    
    # Update room state
    room.status = "active"
    room.current_auction = f"auction_{room_id}_{player_data['id']}"
    if player_data["id"] in room.auction_queue:
        room.auction_queue.remove(player_data["id"])
    
    return {
        "success": True,
        "message": f"Auction started for {player_data['name']}",
        "auction": manager.active_auctions[room_id].dict()
    }

@router.get("/rooms/{room_id}/status")
async def get_room_status(room_id: str):
    """Get current status of auction room"""
    if room_id not in auction_rooms:
        raise HTTPException(status_code=404, detail="Auction room not found")
    
    room = auction_rooms[room_id]
    participants_online = len(manager.room_participants.get(room_id, []))
    
    current_auction = None
    if room_id in manager.active_auctions:
        auction = manager.active_auctions[room_id]
        current_auction = {
            "id": auction.id,
            "player_name": auction.player_name,
            "current_bid": auction.current_bid,
            "current_winner": auction.current_winner_username,
            "time_remaining": auction.time_remaining,
            "total_bids": auction.total_bids,
            "participants_count": len(auction.participants)
        }
    
    return {
        "room_id": room_id,
        "room_name": room.name,
        "status": room.status,
        "participants_online": participants_online,
        "max_participants": room.max_participants,
        "current_auction": current_auction,
        "remaining_players": len(room.auction_queue),
        "completed_auctions": len(room.completed_auctions),
        "timestamp": datetime.now().isoformat()
    }

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str = Query(...), username: str = Query(...)):
    """WebSocket endpoint for real-time auction participation"""
    
    # Validate room exists
    if room_id not in auction_rooms:
        await websocket.close(code=4004, reason="Auction room not found")
        return
    
    # Connect user to WebSocket
    await manager.connect(websocket, user_id, username)
    
    try:
        # Join auction room
        await manager.join_room(user_id, username, room_id)
        
        # Listen for messages
        while True:
            try:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                message_type = message.get("type")
                
                if message_type == "place_bid":
                    bid_amount = message.get("amount", 0)
                    success = await manager.place_bid(user_id, username, room_id, bid_amount)
                    
                    if success:
                        # Send confirmation to bidder
                        await manager.send_personal_message({
                            "type": "bid_confirmed",
                            "message": f"Bid of £{bid_amount:,} placed successfully",
                            "new_budget": manager.user_budgets.get(user_id, 0),
                            "timestamp": datetime.now().isoformat()
                        }, user_id)
                
                elif message_type == "get_status":
                    # Send current room status
                    await manager.send_room_state(user_id, room_id)
                
                elif message_type == "ping":
                    # Keep-alive ping
                    await manager.send_personal_message({
                        "type": "pong",
                        "timestamp": datetime.now().isoformat()
                    }, user_id)
                
            except json.JSONDecodeError:
                await manager.send_personal_message({
                    "type": "error",
                    "message": "Invalid JSON message format",
                    "timestamp": datetime.now().isoformat()
                }, user_id)
            
            except Exception as e:
                await manager.send_personal_message({
                    "type": "error",
                    "message": f"Error processing message: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }, user_id)
    
    except WebSocketDisconnect:
        # Handle user disconnection
        await manager.leave_room(user_id, room_id)
        await manager.disconnect(user_id)
    
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
        await manager.disconnect(user_id)

@router.get("/rooms/{room_id}/history")
async def get_auction_history(room_id: str):
    """Get auction history for a room"""
    if room_id not in auction_rooms:
        raise HTTPException(status_code=404, detail="Auction room not found")
    
    # In a real app, this would query the database
    # For now, return empty history
    return {
        "room_id": room_id,
        "completed_auctions": [],
        "total_auctions": 0,
        "timestamp": datetime.now().isoformat()
    }

# Test endpoint to create a sample room
@router.post("/test-room")
async def create_test_room():
    """Create a test auction room for development"""
    room = AuctionRoom(
        name="Test Cricket Auction",
        description="Test room for cricket player auctions",
        max_participants=10,
        created_by="test_user",
        auction_queue=[player["id"] for player in CRICKET_PLAYERS[:3]]  # First 3 players
    )
    
    auction_rooms[room.id] = room
    
    return {
        "success": True,
        "room": room.dict(),
        "message": "Test auction room created",
        "websocket_url": f"/api/auctions/ws/{room.id}?user_id=YOUR_USER_ID&username=YOUR_USERNAME"
    }