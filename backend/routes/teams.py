from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.team import Team, TeamCreate, TeamUpdate, TeamPlayer
from services.database import DatabaseService, teams_collection

router = APIRouter(prefix="/api/teams", tags=["teams"])

@router.post("/", response_model=Team)
async def create_team(team_data: TeamCreate):
    """Create a new team"""
    team = Team(**team_data.dict())
    await DatabaseService.create_document(teams_collection, team.dict())
    return team

@router.get("/", response_model=List[Team])
async def get_teams(limit: int = 50, owner_id: Optional[str] = None):
    """Get all teams with optional filtering by owner"""
    filter_dict = {}
    if owner_id:
        filter_dict["owner_id"] = owner_id
    
    teams_data = await DatabaseService.get_documents(teams_collection, filter_dict, limit)
    return [Team(**team) for team in teams_data]

@router.get("/{team_id}", response_model=Team)
async def get_team(team_id: str):
    """Get a specific team by ID"""
    team_data = await DatabaseService.get_document(teams_collection, team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Team not found")
    return Team(**team_data)

@router.put("/{team_id}", response_model=Team)
async def update_team(team_id: str, update_data: TeamUpdate):
    """Update a team"""
    existing_team = await DatabaseService.get_document(teams_collection, team_id)
    if not existing_team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    updated = await DatabaseService.update_document(
        teams_collection, 
        team_id, 
        update_data.dict(exclude_unset=True)
    )
    
    if not updated:
        raise HTTPException(status_code=400, detail="Update failed")
    
    team_data = await DatabaseService.get_document(teams_collection, team_id)
    return Team(**team_data)

@router.delete("/{team_id}")
async def delete_team(team_id: str):
    """Delete a team"""
    deleted = await DatabaseService.delete_document(teams_collection, team_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Team not found")
    return {"message": "Team deleted successfully"}

@router.post("/{team_id}/players")
async def add_player_to_team(team_id: str, player_data: TeamPlayer):
    """Add a player to a team"""
    team_data = await DatabaseService.get_document(teams_collection, team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team = Team(**team_data)
    
    # Check if team has space
    if len(team.players) >= team.max_players:
        raise HTTPException(status_code=400, detail="Team is full")
    
    # Check if player already in team
    if any(p.player_id == player_data.player_id for p in team.players):
        raise HTTPException(status_code=400, detail="Player already in team")
    
    # Check budget
    if team.spent + player_data.purchase_price > team.budget:
        raise HTTPException(status_code=400, detail="Insufficient budget")
    
    # Add player and update budget
    updated_players = team.players + [player_data]
    new_spent = team.spent + player_data.purchase_price
    new_remaining = team.budget - new_spent
    
    update_data = {
        "players": [p.dict() for p in updated_players],
        "spent": new_spent,
        "remaining": new_remaining
    }
    
    await DatabaseService.update_document(teams_collection, team_id, update_data)
    
    # Return updated team
    updated_team_data = await DatabaseService.get_document(teams_collection, team_id)
    return Team(**updated_team_data)

@router.delete("/{team_id}/players/{player_id}")
async def remove_player_from_team(team_id: str, player_id: str):
    """Remove a player from a team"""
    team_data = await DatabaseService.get_document(teams_collection, team_id)
    if not team_data:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team = Team(**team_data)
    
    # Find and remove player
    player_to_remove = None
    updated_players = []
    
    for player in team.players:
        if player.player_id == player_id:
            player_to_remove = player
        else:
            updated_players.append(player)
    
    if not player_to_remove:
        raise HTTPException(status_code=404, detail="Player not found in team")
    
    # Update budget
    new_spent = team.spent - player_to_remove.purchase_price
    new_remaining = team.budget - new_spent
    
    update_data = {
        "players": [p.dict() for p in updated_players],
        "spent": new_spent,
        "remaining": new_remaining
    }
    
    await DatabaseService.update_document(teams_collection, team_id, update_data)
    
    return {"message": "Player removed from team successfully"}