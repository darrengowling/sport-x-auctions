from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid

class LeagueType(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"

class LeagueStatus(str, Enum):
    JOINING = "joining"
    ACTIVE = "active"
    UPCOMING = "upcoming"
    COMPLETED = "completed"

class League(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: LeagueType
    status: LeagueStatus
    creator_id: str
    creator_name: str
    participants: List[str] = []  # team_ids
    max_participants: Optional[int] = None
    prize_pool: str
    entry_fee: str
    code: Optional[str] = None
    description: Optional[str] = None
    auction_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LeagueCreate(BaseModel):
    name: str
    type: LeagueType
    creator_name: str
    max_participants: Optional[int] = None
    prize_pool: str
    entry_fee: str
    description: Optional[str] = None

class LeagueUpdate(BaseModel):
    status: Optional[LeagueStatus] = None
    participants: Optional[List[str]] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)