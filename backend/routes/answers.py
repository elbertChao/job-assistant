import json
import os
from fastapi import APIRouter, HTTPException
from models import AnswerRequest, ScoreRequest, ScoreResponse, BreakdownItem
from services.logger import logger
from openai import OpenAI
from utils.jd_utils import extract_job_description

router = APIRouter(prefix="/api")

# initialize client once
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/generate/answer")
def generate_answer(payload: AnswerRequest):
    logger.info(f"Generating answer for user {payload.user_id} - Question: {payload.question!r}")

    instructions = (
        "You are an intelligent interview coach. "
        "Use the following resume and job description to craft feedback:\n\n"
        f"RESUME:\n{payload.resume_text}\n\n"
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
    
@router.post("/generate/score", response_model=ScoreResponse)
def generate_score(payload: ScoreRequest):
    logger.info("Scoring resume against JD URL %s", payload.jd_url)

    # 1) scrape the JD
    jd_text = extract_job_description(payload.jd_url)
    if not jd_text:
        raise HTTPException(400, "Could not extract job description from that URL")

    # 2) build instructions to force JSON output
    instructions = (
        "You are a resume-scoring assistant. Compare the resume to the job description and:\n"
        "  1) Give an overall matching score (0-100).\n"
        "  2) Provide a detailed `breakdown` array, where each item has:\n"
        "      - `category`: name of the section (e.g. \"Work Experience\").\n"
        "      - `score`: points earned.\n"
        "      - `maxScore`: maximum possible points.\n"
        "      - `feedback`: a short summary comment.\n"
        "      - `suggestions`: an array of 1-3 bullet-point suggestions.\n"
        "Return ONLY a JSON object matching the schema:\n"
        "{\n"
        "  \"overallScore\": <integer>,\n"
        "  \"breakdown\": [ { /* BreakdownItem */ }, … ]\n"
        "}"
    )

    # 3) package both texts as the user input
    user_input = (
        f"RESUME:\n{payload.resume_text}\n\n"
        f"JOB DESCRIPTION:\n{jd_text}"
    )

    # 4) call OpenAI
    try:
        resp = client.responses.create(
            model="gpt-4.1-nano",
            instructions=instructions,
            input=user_input,
        )
        output = resp.output_text.strip()
        parsed = json.loads(output)
    except json.JSONDecodeError:
        logger.error("Invalid JSON from model: %s", output)
        raise HTTPException(500, "Scoring model returned malformed JSON")
    except Exception as e:
        logger.error("OpenAI error: %s", e)
        raise HTTPException(500, "Failed to score resume")

    return {
        "overallScore": parsed["overallScore"],
        "breakdown": parsed["breakdown"]
    }
