from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
import os

security = HTTPBearer()

JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
JWT_ALG = "HS256"  # Supabase default

def verify_jwt_token(request: Request, credentials=Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        request.state.user = payload  # Save to request for downstream access
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )