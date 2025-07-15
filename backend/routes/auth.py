from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
import hashlib
import secrets
import uuid
import jwt
from typing import Optional
import os
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorClient

from models.user_auth import (
    UserCreate, UserLogin, PhoneCreate, PhoneLogin, 
    PhoneVerification, SocialLogin, GuestLogin, 
    User, UserResponse
)

router = APIRouter(prefix="/auth", tags=["authentication"])

# JWT Secret - in production this should be in environment variables
JWT_SECRET = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = timedelta(days=30)

# Mock phone verification codes (in production use SMS service)
verification_codes = {}

# Database dependency
async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    return db

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def create_jwt_token(user_data: dict) -> str:
    """Create JWT token"""
    payload = {
        "user_id": user_data["id"],
        "email": user_data.get("email"),
        "exp": datetime.utcnow() + JWT_EXPIRATION
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> Optional[dict]:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@router.post("/register", response_model=UserResponse)
async def register_with_email(user_data: UserCreate, db: AsyncIOMotorDatabase = None):
    """Register new user with email and password"""
    # For now, we'll use mock data since we don't have the DB dependency set up
    # In production, this would check if email exists and save to database
    
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    
    # Mock user creation
    user = {
        "id": user_id,
        "firstName": user_data.firstName,
        "lastName": user_data.lastName,
        "email": user_data.email,
        "favoriteTeam": user_data.favoriteTeam,
        "provider": "email",
        "isGuest": False,
        "level": "Rookie",
        "totalWins": 0,
        "totalMatches": 0,
        "winRate": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/login", response_model=UserResponse)
async def login_with_email(login_data: UserLogin):
    """Login with email and password"""
    # Mock login - in production, verify against database
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    
    user = {
        "id": user_id,
        "firstName": "John",
        "lastName": "Doe",
        "email": login_data.email,
        "favoriteTeam": "RCB",
        "provider": "email",
        "isGuest": False,
        "level": "Pro Bidder",
        "totalWins": 12,
        "totalMatches": 28,
        "winRate": 42.8,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/register/phone", response_model=UserResponse)
async def register_with_phone(phone_data: PhoneCreate):
    """Register new user with phone number"""
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    
    user = {
        "id": user_id,
        "firstName": phone_data.firstName,
        "lastName": phone_data.lastName,
        "phoneNumber": phone_data.phoneNumber,
        "favoriteTeam": phone_data.favoriteTeam,
        "provider": "phone",
        "isGuest": False,
        "level": "Rookie",
        "totalWins": 0,
        "totalMatches": 0,
        "winRate": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/login/phone", response_model=UserResponse)
async def login_with_phone(phone_data: PhoneLogin):
    """Login with phone number and verification code"""
    # Verify the code
    if phone_data.phoneNumber not in verification_codes:
        raise HTTPException(status_code=400, detail="No verification code sent")
    
    if verification_codes[phone_data.phoneNumber] != phone_data.verificationCode:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Clear the verification code
    del verification_codes[phone_data.phoneNumber]
    
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    
    user = {
        "id": user_id,
        "firstName": "Phone",
        "lastName": "User",
        "phoneNumber": phone_data.phoneNumber,
        "favoriteTeam": "MI",
        "provider": "phone",
        "isGuest": False,
        "level": "Pro Bidder",
        "totalWins": 8,
        "totalMatches": 15,
        "winRate": 53.3,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/phone/send-code")
async def send_phone_verification(phone_data: PhoneVerification):
    """Send verification code to phone number"""
    # Generate a 6-digit code
    code = f"{secrets.randbelow(900000) + 100000}"
    
    # Store the code (in production, also send SMS)
    verification_codes[phone_data.phoneNumber] = code
    
    # In production, you would send SMS here
    print(f"Verification code for {phone_data.phoneNumber}: {code}")
    
    return {"message": "Verification code sent successfully"}

@router.post("/phone/verify-code")
async def verify_phone_code(phone_data: PhoneLogin):
    """Verify phone verification code"""
    if phone_data.phoneNumber not in verification_codes:
        raise HTTPException(status_code=400, detail="No verification code sent")
    
    if verification_codes[phone_data.phoneNumber] != phone_data.verificationCode:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    return {"message": "Code verified successfully"}

@router.post("/google", response_model=UserResponse)
async def google_login(social_data: SocialLogin):
    """Login/Register with Google"""
    user_id = f"google_{social_data.id}"
    
    user = {
        "id": user_id,
        "firstName": social_data.firstName,
        "lastName": social_data.lastName,
        "email": social_data.email,
        "avatar": social_data.avatar,
        "provider": "google",
        "isGuest": False,
        "level": "Pro Bidder",
        "totalWins": 15,
        "totalMatches": 32,
        "winRate": 46.9,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/facebook", response_model=UserResponse)
async def facebook_login(social_data: SocialLogin):
    """Login/Register with Facebook"""
    user_id = f"facebook_{social_data.id}"
    
    user = {
        "id": user_id,
        "firstName": social_data.firstName,
        "lastName": social_data.lastName,
        "email": social_data.email,
        "avatar": social_data.avatar,
        "provider": "facebook",
        "isGuest": False,
        "level": "Champion",
        "totalWins": 22,
        "totalMatches": 45,
        "winRate": 48.9,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/apple", response_model=UserResponse)
async def apple_login(social_data: SocialLogin):
    """Login/Register with Apple"""
    user_id = f"apple_{social_data.id}"
    
    user = {
        "id": user_id,
        "firstName": social_data.firstName,
        "lastName": social_data.lastName,
        "email": social_data.email,
        "avatar": social_data.avatar,
        "provider": "apple",
        "isGuest": False,
        "level": "Master",
        "totalWins": 18,
        "totalMatches": 35,
        "winRate": 51.4,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.post("/guest", response_model=UserResponse)
async def guest_login(guest_data: GuestLogin):
    """Login as guest user"""
    user_id = f"guest_{guest_data.deviceId}"
    
    user = {
        "id": user_id,
        "firstName": "Guest",
        "lastName": "User",
        "provider": "guest",
        "isGuest": True,
        "level": "Visitor",
        "totalWins": 0,
        "totalMatches": 0,
        "winRate": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    token = create_jwt_token(user)
    
    return UserResponse(
        token=token,
        user=User(**user)
    )

@router.get("/me", response_model=User)
async def get_current_user(token: str = None):
    """Get current authenticated user"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
    
    payload = verify_jwt_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # In production, fetch user from database using payload['user_id']
    # For now, return mock user data
    user = {
        "id": payload["user_id"],
        "firstName": "Current",
        "lastName": "User",
        "email": payload.get("email"),
        "provider": "email",
        "isGuest": False,
        "level": "Pro Bidder",
        "totalWins": 12,
        "totalMatches": 28,
        "winRate": 42.8,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    return User(**user)