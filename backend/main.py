import os, uvicorn
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, answers, resumes

app = FastAPI()

# USE FOR LOCAL DEVELOPMENT
# enable CORS so frontend can talk to backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # allow frontend origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# USE FOR PRODUCTION
# You’ll set FRONTEND_ORIGIN=https://<your-vercel-url> (or * to allow all) on Render
app.add_middleware(
  CORSMiddleware,
  allow_origins=[os.environ.get("FRONTEND_ORIGIN", "*")],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# include route modules
app.include_router(users.router)
app.include_router(resumes.router)
app.include_router(answers.router)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)