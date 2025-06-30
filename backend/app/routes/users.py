from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserResponse
from app.db.database import db
import uuid
import bcrypt
import logging

router = APIRouter()

@router.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    user_dict = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": hashed_pw.decode('utf-8'),
    }
    await db.users.insert_one(user_dict)
    logging.info(f"User created: {user_dict['id']}")
    return {"id": user_dict["id"], "name": user_dict["name"], "email": user_dict["email"]}
