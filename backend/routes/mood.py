from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from backend.services.auth_service import hash_password, verify_password, create_access_token, decode_token
from backend.routes.auth import get_current_user, get_db
from datetime import datetime
from bson import ObjectId
import os
from backend.models.user import UserRegister, UserLogin

router = APIRouter(prefix="/mood", tags=["mood"])

@router.post("/log")
async def log_mood(mood: MoodLog, user_id: str = Depends(get_current_user)):
    db = get_db()
    coping = suggest_coping_strategy(mood.mood_label, mood.mood_score)
    journal_prompt = generate_journal_prompt(mood.mood_label, mood.mood_score, mood.notes)
    
    doc = {
        "user_id": user_id,
        "date": mood.date,
        "mood_score": mood.mood_score,
        "mood_label": mood.mood_label,
        "notes": mood.notes,
        "created_at": datetime.utcnow()
    }
    result = await db.moods.insert_one(doc)
    return {
        "id": str(result.inserted_id),
        "coping_strategies": coping,
        "journal_prompt": journal_prompt
    }

@router.get("/history")
async def get_mood_history(user_id: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.moods.find({"user_id": user_id}).sort("date", -1).limit(30)
    moods = []
    async for doc in cursor:
        moods.append({
            "id": str(doc["_id"]),
            "date": doc["date"],
            "mood_score": doc["mood_score"],
            "mood_label": doc["mood_label"],
            "notes": doc.get("notes", "")
        })
    return moods