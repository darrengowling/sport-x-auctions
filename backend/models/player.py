from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class PlayerStats(BaseModel):
    matches: int = 0
    runs: int = 0
    wickets: int = 0
    average: float = 0.0
    strike_rate: float = 0.0
    economy: Optional[float] = None
    centuries: int = 0
    fifties: int = 0
    best_figures: Optional[str] = None

class Player(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    team: str
    role: str  # Batsman, Bowler, All-rounder, Wicket-Keeper
    base_price: int
    current_bid: int = 0
    image_url: str
    stats: PlayerStats
    is_hot_pick: bool = False
    bidders: List[str] = []
    auction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PlayerCreate(BaseModel):
    name: str
    team: str
    role: str
    base_price: int
    image_url: str
    stats: PlayerStats
    is_hot_pick: bool = False

class PlayerUpdate(BaseModel):
    current_bid: Optional[int] = None
    bidders: Optional[List[str]] = None
    is_hot_pick: Optional[bool] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)