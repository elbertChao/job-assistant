from fastapi import APIRouter, Request
import logging

router = APIRouter()

@router.post("/api/resume/analyze")
async def analyze_resume(request: Request):
    data = await request.json()
    logging.info("Resume analysis requested", extra={"request": data})
    
    # Return mocked response for now
    return {
        "score": 82,
        "strengths": ["Experience", "Skills match"],
        "improvements": ["Add measurable outcomes"]
    }
