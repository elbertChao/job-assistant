from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserResponse
from app.db.database import db
import uuid
import logging

router = APIRouter()

@router.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    user_dict = user.dict()
    user_dict["id"] = str(uuid.uuid4())
    await db.users.insert_one(user_dict)
    logging.info(f"Created user: {user_dict['id']}")
    return user_dict

@router.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
