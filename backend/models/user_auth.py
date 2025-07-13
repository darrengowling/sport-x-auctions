from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    favoriteTeam: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PhoneCreate(BaseModel):
    phoneNumber: str
    firstName: str
    lastName: str
    favoriteTeam: Optional[str] = None

class PhoneLogin(BaseModel):
    phoneNumber: str
    verificationCode: str

class PhoneVerification(BaseModel):
    phoneNumber: str

class SocialLogin(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    avatar: Optional[str] = None
    provider: str

class GuestLogin(BaseModel):
    deviceId: str

class User(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: Optional[str] = None
    phoneNumber: Optional[str] = None
    avatar: Optional[str] = None
    favoriteTeam: Optional[str] = None
    provider: Optional[str] = "email"  # email, phone, google, facebook, apple, guest
    isGuest: bool = False
    level: str = "Rookie"
    totalWins: int = 0
    totalMatches: int = 0
    winRate: float = 0.0
    created_at: datetime
    updated_at: datetime

class UserResponse(BaseModel):
    token: str
    user: User