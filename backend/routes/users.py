import os
import requests
from fastapi import APIRouter, Request, Header, HTTPException
from typing import Optional
from datetime import datetime
from models import User

router = APIRouter()

# read the vars that main.py already loaded
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

# ensure we have the required environment variables and raise an error if not
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set")

@router.post("/api/users")
def create_user(
    user: User,
    request: Request,
    authorization: str = Header(...),
):
    # 1) Validate & extract Bearer token
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]

    # 2) Build request payload
    payload = {
        "id":         user.id,
        "email":      user.email,
        "full_name":  user.full_name,
        "avatar_url": user.avatar_url or "",
    }

    headers = {
        "apikey":        SUPABASE_KEY,
        "Authorization": f"Bearer {token}",
        "Content-Type":  "application/json",
        # ask PostgREST to give us back the inserted row
        "Prefer":        "return=representation",
    }

    # 3) Insert into 'profiles' via REST
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/profiles",
        json=payload,
        headers=headers,
    )

    # 4) Handle errors
    if resp.status_code == 409:
        # unique violation: row already exists; fetch it
        get_resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user.id}",
            headers=headers,
        )
        if not get_resp.ok:
            raise HTTPException(get_resp.status_code, get_resp.text)
        return get_resp.json()[0]

    if not resp.ok:
        # bubble up the PostgREST error
        raise HTTPException(resp.status_code, resp.text)

    # 5) Return the newly created profile
    return resp.json()

@router.get("/api/users/{user_id}")
def get_user(user_id: str, authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]

    headers = {
        "apikey":        SUPABASE_KEY,
        "Authorization": f"Bearer {token}",
    }

    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}&select=*",
        headers=headers,
    )
    if not resp.ok:
        raise HTTPException(resp.status_code, resp.text)

    result = resp.json()
    if not result:
        raise HTTPException(404, "User not found")
    return result[0]