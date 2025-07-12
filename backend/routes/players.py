from fastapi import APIRouter, HTTPException
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.player import Player, PlayerCreate, PlayerUpdate
from services.database import DatabaseService, db

router = APIRouter(prefix="/api/players", tags=["players"])
players_collection = db.players

@router.post("/", response_model=Player)
async def create_player(player_data: PlayerCreate):
    """Create a new player"""
    player = Player(**player_data.dict())
    await DatabaseService.create_document(players_collection, player.dict())
    return player

@router.get("/", response_model=List[Player])
async def get_players(
    limit: int = 50,
    is_hot_pick: Optional[bool] = None,
    role: Optional[str] = None,
    team: Optional[str] = None
):
    """Get all players with optional filtering"""
    filter_dict = {}
    if is_hot_pick is not None:
        filter_dict["is_hot_pick"] = is_hot_pick
    if role:
        filter_dict["role"] = role
    if team:
        filter_dict["team"] = team
    
    players_data = await DatabaseService.get_documents(players_collection, filter_dict, limit)
    return [Player(**player) for player in players_data]

@router.get("/{player_id}", response_model=Player)
async def get_player(player_id: str):
    """Get a specific player by ID"""
    player_data = await DatabaseService.get_document(players_collection, player_id)
    if not player_data:
        raise HTTPException(status_code=404, detail="Player not found")
    return Player(**player_data)

@router.put("/{player_id}", response_model=Player)
async def update_player(player_id: str, update_data: PlayerUpdate):
    """Update a player"""
    # Check if player exists
    existing_player = await DatabaseService.get_document(players_collection, player_id)
    if not existing_player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Update the player
    updated = await DatabaseService.update_document(
        players_collection, 
        player_id, 
        update_data.dict(exclude_unset=True)
    )
    
    if not updated:
        raise HTTPException(status_code=400, detail="Update failed")
    
    # Return updated player
    player_data = await DatabaseService.get_document(players_collection, player_id)
    return Player(**player_data)

@router.delete("/{player_id}")
async def delete_player(player_id: str):
    """Delete a player"""
    deleted = await DatabaseService.delete_document(players_collection, player_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"message": "Player deleted successfully"}

@router.get("/search/{query}", response_model=List[Player])
async def search_players(query: str, limit: int = 20):
    """Search players by name or team"""
    players_data = await DatabaseService.search_documents(
        players_collection, 
        query, 
        ["name", "team"], 
        limit
    )
    return [Player(**player) for player in players_data]

@router.post("/{player_id}/bid")
async def place_bid(player_id: str, bid_amount: int, team_name: str):
    """Place a bid on a player"""
    player_data = await DatabaseService.get_document(players_collection, player_id)
    if not player_data:
        raise HTTPException(status_code=404, detail="Player not found")
    
    player = Player(**player_data)
    
    if bid_amount <= player.current_bid:
        raise HTTPException(status_code=400, detail="Bid must be higher than current bid")
    
    # Update player with new bid
    update_data = {
        "current_bid": bid_amount,
        "bidders": list(set(player.bidders + [team_name]))  # Add team to bidders if not already present
    }
    
    await DatabaseService.update_document(players_collection, player_id, update_data)
    
    # Return updated player
    updated_player_data = await DatabaseService.get_document(players_collection, player_id)
    return Player(**updated_player_data)