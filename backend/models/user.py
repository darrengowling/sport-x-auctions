from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    username: str
    email: str
    avatar_url: str
    level: str = "Rookie Bidder"
    total_wins: int = 0
    total_matches: int = 0
    win_rate: float = 0.0
    favorite_team: str = "RCB"
    team_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    username: str
    email: str
    avatar_url: str
    favorite_team: str = "RCB"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = None
    total_wins: Optional[int] = None
    total_matches: Optional[int] = None
    win_rate: Optional[float] = None
    favorite_team: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)