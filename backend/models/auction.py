from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class AuctionRoom(BaseModel):
    id: str = Field(default_factory=lambda: f"room_{uuid.uuid4().hex[:8]}")
    name: str
    description: str
    max_participants: int = 20
    current_participants: int = 0
    participants: List[str] = []  # user_ids
    participant_details: List[Dict[str, Any]] = []  # user details for display
    budget_per_user: int = 100_000_000  # £100M
    status: str = "waiting"  # waiting, active, completed
    current_auction: Optional[str] = None  # current auction_id
    auction_queue: List[str] = []  # player_ids to auction
    completed_auctions: List[str] = []
    created_by: str
    created_at: datetime = Field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

class AuctionEvent(BaseModel):
    id: str = Field(default_factory=lambda: f"event_{uuid.uuid4().hex[:8]}")
    room_id: str
    auction_id: str
    event_type: str  # bid_placed, auction_started, auction_ended, user_joined, user_left
    user_id: Optional[str] = None
    username: Optional[str] = None
    data: Dict[str, Any] = {}
    timestamp: datetime = Field(default_factory=datetime.now)

class PlayerAuction(BaseModel):
    id: str = Field(default_factory=lambda: f"auction_{uuid.uuid4().hex[:8]}")
    room_id: str
    player_id: str
    player_name: str
    player_team: str
    player_position: str
    player_image: str
    player_stats: Dict[str, Any] = {}
    
    # Bidding details
    starting_bid: int = 1_000_000  # £1M minimum
    current_bid: int = 1_000_000
    bid_increment: int = 1_000_000  # £1M increments
    minimum_next_bid: int = 2_000_000
    
    # Current state
    current_winner: Optional[str] = None
    current_winner_username: Optional[str] = None
    total_bids: int = 0
    
    # Timing
    auction_duration: int = 300  # 5 minutes total
    time_remaining: int = 300
    last_bid_time: Optional[datetime] = None
    quick_finish_threshold: int = 10  # seconds of no bids to finish early
    
    # Participants
    participants: List[str] = []  # user_ids who have bid
    participant_usernames: List[str] = []
    watchers: List[str] = []  # user_ids watching but not bidding
    
    # Status
    status: str = "waiting"  # waiting, active, sold, unsold, cancelled
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)

class BidAttempt(BaseModel):
    auction_id: str
    user_id: str
    username: str
    bid_amount: int
    user_budget_remaining: int
    timestamp: datetime = Field(default_factory=datetime.now)

class AuctionResult(BaseModel):
    auction_id: str
    player_id: str
    player_name: str
    winning_bid: int
    winner_user_id: Optional[str] = None
    winner_username: Optional[str] = None
    total_bids: int
    participants_count: int
    auction_duration: int  # actual duration in seconds
    created_at: datetime = Field(default_factory=datetime.now)