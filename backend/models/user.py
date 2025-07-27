from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: f"user_{uuid.uuid4().hex[:8]}")
    email: str
    username: str
    first_name: str
    last_name: str
    profile_image: Optional[str] = None
    total_budget: int = 100_000_000  # £100M default budget
    current_budget: int = 100_000_000
    total_spent: int = 0
    wins: int = 0
    losses: int = 0
    win_rate: float = 0.0
    total_bids: int = 0
    rank: int = 0
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    is_active: bool = True
    last_login: Optional[datetime] = None

class UserSession(BaseModel):
    user_id: str
    session_id: str
    socket_id: Optional[str] = None
    is_online: bool = True
    last_activity: datetime = Field(default_factory=datetime.now)

class Bid(BaseModel):
    id: str = Field(default_factory=lambda: f"bid_{uuid.uuid4().hex[:8]}")
    auction_id: str
    player_id: str
    user_id: str
    username: str
    amount: int
    timestamp: datetime = Field(default_factory=datetime.now)
    is_winning: bool = False
    
class LiveAuction(BaseModel):
    id: str = Field(default_factory=lambda: f"auction_{uuid.uuid4().hex[:8]}")
    player_id: str
    player_name: str
    player_image: str
    starting_bid: int
    current_bid: int
    current_winner: Optional[str] = None
    current_winner_username: Optional[str] = None
    bid_increment: int = 1_000_000
    time_remaining: int = 300  # 5 minutes in seconds
    total_bids: int = 0
    participants: List[str] = []
    participant_usernames: List[str] = []
    status: str = "waiting"  # waiting, active, completed, cancelled
    started_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now)
    
class BidHistory(BaseModel):
    auction_id: str
    bids: List[Bid] = []
    
class UserStats(BaseModel):
    user_id: str
    username: str
    total_auctions_participated: int = 0
    total_players_won: int = 0
    total_spent: int = 0
    average_bid: float = 0.0
    success_rate: float = 0.0
    current_budget: int = 100_000_000
    rank: int = 0