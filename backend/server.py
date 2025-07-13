from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from datetime import datetime
import os
import logging
from seed_data import PLAYERS_DATA
from pathlib import Path

# Import auth routes
from routes import auth

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Sports X Pro Cricket Auctions API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add basic health check
@api_router.get("/")
async def root():
    return {"message": "Sports X Pro Cricket Auctions API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Sports X API"}

# Simple endpoints for players
@api_router.get("/players")
async def get_players():
    """Get all players"""
    players = await db.players.find().to_list(100)
    for player in players:
        player.pop('_id', None)
    return players

@api_router.get("/players/{player_id}")
async def get_player(player_id: str):
    """Get a specific player"""
    player = await db.players.find_one({"id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    player.pop('_id', None)
    return player

@api_router.post("/players/{player_id}/bid")
async def place_bid(player_id: str, bid_amount: int, team_name: str):
    """Place a bid on a player"""
    player = await db.players.find_one({"id": player_id})
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    if bid_amount <= player.get("current_bid", 0):
        raise HTTPException(status_code=400, detail="Bid must be higher than current bid")
    
    # Update player with new bid
    await db.players.update_one(
        {"id": player_id},
        {
            "$set": {
                "current_bid": bid_amount,
                "updated_at": datetime.utcnow()
            },
            "$addToSet": {"bidders": team_name}
        }
    )
    
    # Return updated player
    updated_player = await db.players.find_one({"id": player_id})
    updated_player.pop('_id', None)
    return updated_player

# Simple endpoints for teams
@api_router.get("/teams")
async def get_teams():
    """Get all teams"""
    teams = await db.teams.find().to_list(100)
    for team in teams:
        team.pop('_id', None)
    return teams

@api_router.get("/teams/{team_id}")
async def get_team(team_id: str):
    """Get a specific team"""
    team = await db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.pop('_id', None)
    return team

# Simple endpoints for auctions
@api_router.get("/auctions")
async def get_auctions():
    """Get all auctions"""
    auctions = await db.auctions.find().to_list(100)
    for auction in auctions:
        auction.pop('_id', None)
    return auctions

@api_router.get("/auctions/{auction_id}")
async def get_auction(auction_id: str):
    """Get a specific auction"""
    auction = await db.auctions.find_one({"id": auction_id})
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    auction.pop('_id', None)
    return auction

# Simple endpoints for leagues
@api_router.get("/leagues")
async def get_leagues():
    """Get all leagues"""
    leagues = await db.leagues.find().to_list(100)
    for league in leagues:
        league.pop('_id', None)
    return leagues

@api_router.get("/leagues/{league_id}")
async def get_league(league_id: str):
    """Get a specific league"""
    league = await db.leagues.find_one({"id": league_id})
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    league.pop('_id', None)
    return league

# Simple endpoints for users
@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Get a specific user"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.pop('_id', None)
    return user

# Include the router in the main app
app.include_router(api_router)

# Include auth routes
app.include_router(auth.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Sports X Pro Cricket Auctions API starting up...")
    await seed_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

async def seed_database():
    """Seed database with initial data"""
    try:
        # Check if data already exists
        existing_players = await db.players.count_documents({})
        if existing_players > 0:
            logger.info("Database already seeded")
            return

        # Seed players using imported data
        await db.players.insert_many(PLAYERS_DATA)
        logger.info(f"Seeded {len(PLAYERS_DATA)} players")

        # Seed a sample user
        user_data = {
            "id": "user-1",
            "name": "Cricket Fan",
            "username": "@cricketfan",
            "email": "fan@sportsx.com",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            "level": "Pro Bidder",
            "total_wins": 12,
            "total_matches": 28,
            "win_rate": 42.8,
            "favorite_team": "RCB",
            "team_ids": ["team-1"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await db.users.insert_one(user_data)
        logger.info("Seeded sample user")

        # Seed sample teams
        teams_data = [
            {
                "id": "team-1",
                "name": "Team Alpha",
                "owner_id": "user-1",
                "owner_name": "Cricket Fan",
                "budget": 50000000,
                "spent": 42000000,
                "remaining": 8000000,
                "players": [
                    {
                        "player_id": "player-1",
                        "purchase_price": 15000000,
                        "role": "Captain"
                    },
                    {
                        "player_id": "player-2",
                        "purchase_price": 12000000,
                        "role": "Vice Captain"
                    },
                    {
                        "player_id": "player-3",
                        "purchase_price": 11000000,
                        "role": "Player"
                    }
                ],
                "max_players": 15,
                "avatar": "🏆",
                "color": "#3B82F6",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "team-2",
                "name": "Thunderbolts",
                "owner_id": "user-2",
                "owner_name": "Alex Kumar",
                "budget": 50000000,
                "spent": 38000000,
                "remaining": 12000000,
                "players": [],
                "max_players": 15,
                "avatar": "⚡",
                "color": "#F59E0B",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]

        await db.teams.insert_many(teams_data)
        logger.info(f"Seeded {len(teams_data)} teams")

        # Seed sample auction
        auction_data = {
            "id": "auction-1",
            "name": "IPL 2025 Mega Auction",
            "status": "live",
            "participants": ["team-1", "team-2"],
            "current_player_id": "player-1",
            "time_remaining": 45,
            "total_budget": 50000000,
            "start_time": datetime.utcnow(),
            "rules": {
                "max_players": 15,
                "min_players": 11,
                "max_overseas": 4,
                "retention_allowed": True
            },
            "bids": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await db.auctions.insert_one(auction_data)
        logger.info("Seeded sample auction")

        # Seed sample leagues
        leagues_data = [
            {
                "id": "league-1",
                "name": "Friends Championship",
                "type": "private",
                "status": "active",
                "creator_id": "user-1",
                "creator_name": "Cricket Fan",
                "participants": ["team-1"],
                "max_participants": 8,
                "prize_pool": "₹50,000",
                "entry_fee": "₹1,000",
                "code": "FRC2025",
                "description": "Epic battle among friends for cricket supremacy!",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "league-2",
                "name": "Global Masters",
                "type": "public",
                "status": "joining",
                "creator_id": "system",
                "creator_name": "Sports X",
                "participants": ["team-1", "team-2"],
                "max_participants": 1000,
                "prize_pool": "₹10,00,000",
                "entry_fee": "₹5,000",
                "description": "The ultimate cricket championship",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]

        await db.leagues.insert_many(leagues_data)
        logger.info(f"Seeded {len(leagues_data)} leagues")

        logger.info("Database seeding completed successfully!")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
