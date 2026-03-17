from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from backend.models.user import UserRegister, UserLogin
from services.ai_service import summarize_journal
from routes.auth import get_current_user, get_db
from datetime import datetime
from backend.services.auth_service import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/journal", tags=["journal"])

@router.post("/entry")
async def add_journal_entry(entry: JournalEntry, user_id: str = Depends(get_current_user)):
    db = get_db()
    ai_summary = summarize_journal(entry.content)
    doc = {
        "user_id": user_id,
        "date": entry.date,
        "content": entry.content,
        "ai_summary": ai_summary,
        "tags": entry.tags,
        "created_at": datetime.utcnow()
    }
    result = await db.journals.insert_one(doc)
    return {"id": str(result.inserted_id), "ai_summary": ai_summary}

@router.get("/entries")
async def get_journal_entries(user_id: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.journals.find({"user_id": user_id}).sort("date", -1).limit(20)
    entries = []
    async for doc in cursor:
        entries.append({
            "id": str(doc["_id"]),
            "date": doc["date"],
            "content": doc["content"],
            "ai_summary": doc["ai_summary"],
            "tags": doc.get("tags", [])
        })
    return entries