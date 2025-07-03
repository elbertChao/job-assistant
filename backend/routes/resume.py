from fastapi import APIRouter, Request, Depends
from models import ResumeData
from services.logger import logger
from services.auth import verify_jwt_token  # auth middleware

router = APIRouter()

@router.post("/api/resume/analyze")
def analyze_resume(
    data: ResumeData,
    request: Request,
    _=Depends(verify_jwt_token),  # require valid JWT
):
    user = request.state.user  # Set in verify_jwt_token
    user_id = user["sub"]  # Supabase Auth UID (subject claim)

    logger.info(f"Analyzing resume for user {user_id}")
    
    # use user_id for logging or DB ops

    return {
        "score": 85,
        "feedback": "Good alignment with job requirements.",
    }
