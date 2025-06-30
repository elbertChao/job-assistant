from fastapi import FastAPI
from app.routes import users, resume, status
from app.core.logger import logging

app = FastAPI()

app.include_router(users.router)
app.include_router(resume.router)
app.include_router(status.router)

logging.info("API Server started.")
