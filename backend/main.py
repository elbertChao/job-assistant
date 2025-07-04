import os
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, resume, answers

app = FastAPI()

# enable CORS so frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include route modules
app.include_router(users.router)
app.include_router(resume.router)
app.include_router(answers.router)
