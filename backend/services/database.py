from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# Database connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
players_collection = db.players
teams_collection = db.teams
auctions_collection = db.auctions
leagues_collection = db.leagues
users_collection = db.users

class DatabaseService:
    @staticmethod
    async def create_document(collection, document: dict) -> str:
        """Create a new document and return its ID"""
        result = await collection.insert_one(document)
        return str(result.inserted_id)
    
    @staticmethod
    async def get_document(collection, document_id: str) -> Optional[dict]:
        """Get a document by ID"""
        document = await collection.find_one({"id": document_id})
        if document:
            document.pop('_id', None)
        return document
    
    @staticmethod
    async def get_documents(collection, filter_dict: dict = {}, limit: int = 100) -> List[dict]:
        """Get multiple documents with optional filtering"""
        cursor = collection.find(filter_dict).limit(limit)
        documents = await cursor.to_list(length=limit)
        for doc in documents:
            doc.pop('_id', None)
        return documents
    
    @staticmethod
    async def update_document(collection, document_id: str, update_data: dict) -> bool:
        """Update a document by ID"""
        result = await collection.update_one(
            {"id": document_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    @staticmethod
    async def delete_document(collection, document_id: str) -> bool:
        """Delete a document by ID"""
        result = await collection.delete_one({"id": document_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def search_documents(collection, search_query: str, fields: List[str], limit: int = 20) -> List[dict]:
        """Search documents by text in specified fields"""
        regex_query = {"$regex": search_query, "$options": "i"}
        or_conditions = [{field: regex_query} for field in fields]
        
        cursor = collection.find({"$or": or_conditions}).limit(limit)
        documents = await cursor.to_list(length=limit)
        for doc in documents:
            doc.pop('_id', None)
        return documents