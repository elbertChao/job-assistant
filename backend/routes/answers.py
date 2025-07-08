import os
from fastapi import APIRouter, HTTPException
from models import AnswerRequest
from services.logger import logger
from openai import OpenAI

router = APIRouter()

# initialize client once
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/api/generate/answer")
def generate_answer(payload: AnswerRequest):
    logger.info(f"Generating answer for user {payload.user_id} - Question: {payload.question!r}")

    instructions = (
        "You are an intelligent interview coach. "
        "Use the following resume and job description to craft feedback:\n\n"
        f"RESUME:\n{payload.resume_content}\n\n"
        f"JOB DESCRIPTION:\n{payload.job_description}\n\n"
        "When the user asks a question, answer as that coach."
    )
    # combine question & JD into a single input
    user_input = f"Question: {payload.question}\nJob Description: {payload.job_description or 'N/A'}"

    try:
        response = client.responses.create(
            model="gpt-4.1-nano", # use a smaller model for cost efficiency
            instructions=instructions,
            input=user_input,
        )
        answer_text = response.output_text.strip()
        return {"answer": answer_text}

    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate answer")