from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid

class AuctionStatus(str, Enum):
    UPCOMING = "upcoming"
    LIVE = "live"
    COMPLETED = "completed"
    PAUSED = "paused"

class AuctionRules(BaseModel):
    max_players: int = 15
    min_players: int = 11
    max_overseas: int = 4
    retention_allowed: bool = True

class Bid(BaseModel):
    team_id: str
    team_name: str
    amount: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Auction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    status: AuctionStatus
    participants: List[str] = []  # team_ids
    current_player_id: Optional[str] = None
    time_remaining: int = 60  # seconds
    total_budget: int = 50000000
    start_time: datetime
    end_time: Optional[datetime] = None
    rules: AuctionRules
    bids: List[Bid] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AuctionCreate(BaseModel):
    name: str
    start_time: datetime
    total_budget: int = 50000000
    rules: Optional[AuctionRules] = AuctionRules()

class AuctionUpdate(BaseModel):
    status: Optional[AuctionStatus] = None
    current_player_id: Optional[str] = None
    time_remaining: Optional[int] = None
    participants: Optional[List[str]] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BidCreate(BaseModel):
    team_id: str
    team_name: str
    amount: int