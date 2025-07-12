from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.auction import Auction, AuctionCreate, AuctionUpdate, BidCreate, Bid
from services.database import DatabaseService, auctions_collection
from datetime import datetime

router = APIRouter(prefix="/api/auctions", tags=["auctions"])

@router.post("/", response_model=Auction)
async def create_auction(auction_data: AuctionCreate):
    """Create a new auction"""
    auction = Auction(**auction_data.dict())
    await DatabaseService.create_document(auctions_collection, auction.dict())
    return auction

@router.get("/", response_model=List[Auction])
async def get_auctions(
    limit: int = 50,
    status: Optional[str] = None
):
    """Get all auctions with optional status filtering"""
    filter_dict = {}
    if status:
        filter_dict["status"] = status
    
    auctions_data = await DatabaseService.get_documents(auctions_collection, filter_dict, limit)
    return [Auction(**auction) for auction in auctions_data]

@router.get("/{auction_id}", response_model=Auction)
async def get_auction(auction_id: str):
    """Get a specific auction by ID"""
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    if not auction_data:
        raise HTTPException(status_code=404, detail="Auction not found")
    return Auction(**auction_data)

@router.put("/{auction_id}", response_model=Auction)
async def update_auction(auction_id: str, update_data: AuctionUpdate):
    """Update an auction"""
    existing_auction = await DatabaseService.get_document(auctions_collection, auction_id)
    if not existing_auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    updated = await DatabaseService.update_document(
        auctions_collection, 
        auction_id, 
        update_data.dict(exclude_unset=True)
    )
    
    if not updated:
        raise HTTPException(status_code=400, detail="Update failed")
    
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    return Auction(**auction_data)

@router.delete("/{auction_id}")
async def delete_auction(auction_id: str):
    """Delete an auction"""
    deleted = await DatabaseService.delete_document(auctions_collection, auction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Auction not found")
    return {"message": "Auction deleted successfully"}

@router.post("/{auction_id}/join")
async def join_auction(auction_id: str, team_id: str):
    """Join an auction with a team"""
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    if not auction_data:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    auction = Auction(**auction_data)
    
    if team_id in auction.participants:
        raise HTTPException(status_code=400, detail="Team already joined auction")
    
    # Add team to participants
    updated_participants = auction.participants + [team_id]
    
    await DatabaseService.update_document(
        auctions_collection, 
        auction_id, 
        {"participants": updated_participants}
    )
    
    return {"message": "Successfully joined auction"}

@router.post("/{auction_id}/bid")
async def place_bid(auction_id: str, bid_data: BidCreate):
    """Place a bid in an auction"""
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    if not auction_data:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    auction = Auction(**auction_data)
    
    if auction.status != "live":
        raise HTTPException(status_code=400, detail="Auction is not live")
    
    if bid_data.team_id not in auction.participants:
        raise HTTPException(status_code=400, detail="Team not participating in auction")
    
    # Check if bid is higher than current highest bid
    current_highest = 0
    if auction.bids:
        current_highest = max(bid.amount for bid in auction.bids)
    
    if bid_data.amount <= current_highest:
        raise HTTPException(status_code=400, detail="Bid must be higher than current highest bid")
    
    # Add bid
    new_bid = Bid(**bid_data.dict())
    updated_bids = auction.bids + [new_bid]
    
    await DatabaseService.update_document(
        auctions_collection, 
        auction_id, 
        {"bids": [bid.dict() for bid in updated_bids]}
    )
    
    return {"message": "Bid placed successfully", "bid": new_bid}

@router.get("/{auction_id}/bids")
async def get_auction_bids(auction_id: str):
    """Get all bids for an auction"""
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    if not auction_data:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    auction = Auction(**auction_data)
    return auction.bids

@router.post("/{auction_id}/start")
async def start_auction(auction_id: str):
    """Start an auction"""
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    if not auction_data:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    await DatabaseService.update_document(
        auctions_collection, 
        auction_id, 
        {"status": "live", "updated_at": datetime.utcnow()}
    )
    
    return {"message": "Auction started successfully"}

@router.post("/{auction_id}/end")
async def end_auction(auction_id: str):
    """End an auction"""
    auction_data = await DatabaseService.get_document(auctions_collection, auction_id)
    if not auction_data:
        raise HTTPException(status_code=404, detail="Auction not found")
    
    await DatabaseService.update_document(
        auctions_collection, 
        auction_id, 
        {
            "status": "completed", 
            "end_time": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    )
    
    return {"message": "Auction ended successfully"}