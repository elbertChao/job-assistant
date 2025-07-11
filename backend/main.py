import os, uvicorn
from dotenv import load_dotenv

load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, answers, resumes

app = FastAPI()

@app.get("/", include_in_schema=False)
async def root():
    return {"status": "ok"}

# (optionally a dedicated health route)
@app.get("/health", include_in_schema=False)
async def health():
    return {"status": "healthy"}

# read the FRONTEND_ORIGIN env‐var (set in Render’s Dashboard)
frontend_origin = os.environ.get("FRONTEND_ORIGIN")  

# You’ll set FRONTEND_ORIGIN=https://<your-vercel-url> (or * to allow all) on Render
app.add_middleware(
  CORSMiddleware,
  allow_origins=[frontend_origin] if frontend_origin else ["*"],
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