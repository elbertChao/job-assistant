from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from supabase_client import supabase

security = HTTPBearer()

def verify_jwt_token(
    request: Request,
    credentials=Depends(security),
):
    token = credentials.credentials
    try:
        # this will call Supabase’s /auth/v1/user endpoint under the hood
        user_resp = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    # user_resp.user is the decoded user record
    request.state.user = user_resp.user  