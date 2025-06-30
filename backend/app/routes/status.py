from fastapi import APIRouter
from app.db.database import db
import logging

router = APIRouter()

@router.get("/api/status")
def health_check():
    return {"status": "ok"}

@router.get("/api/dbstatus")
async def db_status():
    collections = await db.list_collection_names()
    return {"status": "connected", "collections": collections}
