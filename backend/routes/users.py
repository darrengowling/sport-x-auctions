from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.user import User, UserCreate, UserUpdate
from services.database import DatabaseService, users_collection

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=User)
async def create_user(user_data: UserCreate):
    """Create a new user"""
    # Check if username or email already exists
    existing_users = await DatabaseService.get_documents(
        users_collection, 
        {"$or": [{"username": user_data.username}, {"email": user_data.email}]}, 
        1
    )
    
    if existing_users:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user = User(**user_data.dict())
    await DatabaseService.create_document(users_collection, user.dict())
    return user

@router.get("/", response_model=List[User])
async def get_users(limit: int = 50):
    """Get all users"""
    users_data = await DatabaseService.get_documents(users_collection, {}, limit)
    return [User(**user) for user in users_data]

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get a specific user by ID"""
    user_data = await DatabaseService.get_document(users_collection, user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user_data)

@router.get("/username/{username}", response_model=User)
async def get_user_by_username(username: str):
    """Get a user by username"""
    users_data = await DatabaseService.get_documents(users_collection, {"username": username}, 1)
    if not users_data:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**users_data[0])

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, update_data: UserUpdate):
    """Update a user"""
    existing_user = await DatabaseService.get_document(users_collection, user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated = await DatabaseService.update_document(
        users_collection, 
        user_id, 
        update_data.dict(exclude_unset=True)
    )
    
    if not updated:
        raise HTTPException(status_code=400, detail="Update failed")
    
    user_data = await DatabaseService.get_document(users_collection, user_id)
    return User(**user_data)

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete a user"""
    deleted = await DatabaseService.delete_document(users_collection, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.post("/{user_id}/teams/{team_id}")
async def add_team_to_user(user_id: str, team_id: str):
    """Add a team to user's team list"""
    user_data = await DatabaseService.get_document(users_collection, user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = User(**user_data)
    
    if team_id in user.team_ids:
        raise HTTPException(status_code=400, detail="Team already added to user")
    
    updated_team_ids = user.team_ids + [team_id]
    
    await DatabaseService.update_document(
        users_collection, 
        user_id, 
        {"team_ids": updated_team_ids}
    )
    
    return {"message": "Team added to user successfully"}

@router.delete("/{user_id}/teams/{team_id}")
async def remove_team_from_user(user_id: str, team_id: str):
    """Remove a team from user's team list"""
    user_data = await DatabaseService.get_document(users_collection, user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = User(**user_data)
    
    if team_id not in user.team_ids:
        raise HTTPException(status_code=400, detail="Team not found in user's teams")
    
    updated_team_ids = [tid for tid in user.team_ids if tid != team_id]
    
    await DatabaseService.update_document(
        users_collection, 
        user_id, 
        {"team_ids": updated_team_ids}
    )
    
    return {"message": "Team removed from user successfully"}