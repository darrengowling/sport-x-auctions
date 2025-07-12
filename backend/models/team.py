from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class TeamPlayer(BaseModel):
    player_id: str
    purchase_price: int
    role: str  # Captain, Vice Captain, Player

class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    owner_id: str
    owner_name: str
    budget: int = 50000000  # 50 Cr default budget
    spent: int = 0
    remaining: int = 50000000
    players: List[TeamPlayer] = []
    max_players: int = 15
    avatar: str = "🏆"
    color: str = "#3B82F6"
    league_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TeamCreate(BaseModel):
    name: str
    owner_name: str
    avatar: str = "🏆"
    color: str = "#3B82F6"
    league_id: Optional[str] = None

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    spent: Optional[int] = None
    remaining: Optional[int] = None
    players: Optional[List[TeamPlayer]] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)