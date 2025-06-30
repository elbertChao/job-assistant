from fastapi import APIRouter

router = APIRouter()

@router.get("/api/status")
def health_check():
    return {"status": "ok"}
