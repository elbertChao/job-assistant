from fastapi import (
    APIRouter, Depends, HTTPException,
    File, UploadFile, Request, Query
)
from models import ResumeData
from services.logger import logger
from services.auth import verify_jwt_token  # auth middleware
from supabase_client import supabase  # Supabase client
import io
from PyPDF2 import PdfReader

router = APIRouter()

def extract_pdf_text(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    return "\n\n".join(page.extract_text() or "" for page in reader.pages)

@router.post("/api/resume/upload")
async def upload_resume(
    request: Request,
    file: UploadFile = File(...),
    user=Depends(verify_jwt_token)
):
    """
    - Reads the uploaded PDF or text file
    - Extracts its text
    - Inserts into `resumes` (user_id, title, content)
    - Returns the new row’s id & title
    """
    user = request.state.user  
    user_id = user.id  # Supabase Auth UID (subject claim)
    logger.info(f"User {user_id} uploading {file.filename}")

    raw = await file.read()
    if file.content_type == "application/pdf":
        content = extract_pdf_text(raw)
    elif file.content_type.startswith("text/"):
        content = raw.decode("utf-8")
    else:
        raise HTTPException(400, "Unsupported file type")

    resp = (
      supabase
        .from_("resumes")
        .insert({
          "user_id": user_id,
          "title":   file.filename,
          "content": content,
          "file_url": None
        })
        .execute()
    )
    # supabase-py v2: any insert error shows up on resp.error
    if getattr(resp, "error", None):
        raise HTTPException(500, resp.error.message)

    new_row = resp.data[0]
    return {"id": new_row["id"], "title": new_row["title"]}

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

@router.get("/api/resumes")
def list_resumes(user_id: str = Query(...)):
    try:
        resp = (
            supabase
              .from_("resumes")
              .select("id, title, content")
              .eq("user_id", user_id)
              .execute()
        )
        # resp.data is either a list or None
        return resp.data or []
    except Exception as e:
        # catch any underlying HTTP or client errors
        raise HTTPException(status_code=500, detail=str(e))