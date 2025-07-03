from fastapi import APIRouter
from models import AnswerRequest
from services.logger import logger

router = APIRouter()

@router.post("/api/generate/answer")
def generate_answer(payload: AnswerRequest):
    logger.info(f"Generating answer for user {payload.user_id}")
    # Mock generated response
    return {
        "answer": f"This is a tailored answer for {payload.question}",
    }
