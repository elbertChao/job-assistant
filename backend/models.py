from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str]
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ResumeData(BaseModel):
    user_id: str
    resume_text: str

class AnswerRequest(BaseModel):
    user_id: str
    question: str
    job_description: str
