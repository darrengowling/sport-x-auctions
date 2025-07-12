from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.league import League, LeagueCreate, LeagueUpdate
from services.database import DatabaseService, leagues_collection
import random
import string

router = APIRouter(prefix="/api/leagues", tags=["leagues"])

def generate_league_code() -> str:
    """Generate a random league code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.post("/", response_model=League)
async def create_league(league_data: LeagueCreate):
    """Create a new league"""
    league_dict = league_data.dict()
    
    # Generate code for private leagues
    if league_data.type == "private":
        league_dict["code"] = generate_league_code()
    
    league = League(**league_dict)
    await DatabaseService.create_document(leagues_collection, league.dict())
    return league

@router.get("/", response_model=List[League])
async def get_leagues(
    limit: int = 50,
    type: Optional[str] = None,
    status: Optional[str] = None,
    creator_id: Optional[str] = None
):
    """Get all leagues with optional filtering"""
    filter_dict = {}
    if type:
        filter_dict["type"] = type
    if status:
        filter_dict["status"] = status
    if creator_id:
        filter_dict["creator_id"] = creator_id
    
    leagues_data = await DatabaseService.get_documents(leagues_collection, filter_dict, limit)
    return [League(**league) for league in leagues_data]

@router.get("/{league_id}", response_model=League)
async def get_league(league_id: str):
    """Get a specific league by ID"""
    league_data = await DatabaseService.get_document(leagues_collection, league_id)
    if not league_data:
        raise HTTPException(status_code=404, detail="League not found")
    return League(**league_data)

@router.get("/code/{code}", response_model=League)
async def get_league_by_code(code: str):
    """Get a league by its code"""
    leagues_data = await DatabaseService.get_documents(leagues_collection, {"code": code.upper()}, 1)
    if not leagues_data:
        raise HTTPException(status_code=404, detail="League not found")
    return League(**leagues_data[0])

@router.put("/{league_id}", response_model=League)
async def update_league(league_id: str, update_data: LeagueUpdate):
    """Update a league"""
    existing_league = await DatabaseService.get_document(leagues_collection, league_id)
    if not existing_league:
        raise HTTPException(status_code=404, detail="League not found")
    
    updated = await DatabaseService.update_document(
        leagues_collection, 
        league_id, 
        update_data.dict(exclude_unset=True)
    )
    
    if not updated:
        raise HTTPException(status_code=400, detail="Update failed")
    
    league_data = await DatabaseService.get_document(leagues_collection, league_id)
    return League(**league_data)

@router.delete("/{league_id}")
async def delete_league(league_id: str):
    """Delete a league"""
    deleted = await DatabaseService.delete_document(leagues_collection, league_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="League not found")
    return {"message": "League deleted successfully"}

@router.post("/{league_id}/join")
async def join_league(league_id: str, team_id: str):
    """Join a league with a team"""
    league_data = await DatabaseService.get_document(leagues_collection, league_id)
    if not league_data:
        raise HTTPException(status_code=404, detail="League not found")
    
    league = League(**league_data)
    
    if team_id in league.participants:
        raise HTTPException(status_code=400, detail="Team already joined league")
    
    # Check if league is full
    if league.max_participants and len(league.participants) >= league.max_participants:
        raise HTTPException(status_code=400, detail="League is full")
    
    # Add team to participants
    updated_participants = league.participants + [team_id]
    
    await DatabaseService.update_document(
        leagues_collection, 
        league_id, 
        {"participants": updated_participants}
    )
    
    return {"message": "Successfully joined league"}

@router.post("/join-by-code")
async def join_league_by_code(code: str, team_id: str):
    """Join a league using league code"""
    leagues_data = await DatabaseService.get_documents(leagues_collection, {"code": code.upper()}, 1)
    if not leagues_data:
        raise HTTPException(status_code=404, detail="Invalid league code")
    
    league = League(**leagues_data[0])
    
    if team_id in league.participants:
        raise HTTPException(status_code=400, detail="Team already joined league")
    
    # Check if league is full
    if league.max_participants and len(league.participants) >= league.max_participants:
        raise HTTPException(status_code=400, detail="League is full")
    
    # Add team to participants
    updated_participants = league.participants + [team_id]
    
    await DatabaseService.update_document(
        leagues_collection, 
        league.id, 
        {"participants": updated_participants}
    )
    
    return {"message": "Successfully joined league", "league": league}

@router.delete("/{league_id}/leave")
async def leave_league(league_id: str, team_id: str):
    """Leave a league"""
    league_data = await DatabaseService.get_document(leagues_collection, league_id)
    if not league_data:
        raise HTTPException(status_code=404, detail="League not found")
    
    league = League(**league_data)
    
    if team_id not in league.participants:
        raise HTTPException(status_code=400, detail="Team not in league")
    
    # Remove team from participants
    updated_participants = [p for p in league.participants if p != team_id]
    
    await DatabaseService.update_document(
        leagues_collection, 
        league_id, 
        {"participants": updated_participants}
    )
    
    return {"message": "Successfully left league"}