from fastapi import APIRouter, Depends
from routes.auth import get_current_user, get_db
from collections import defaultdict
from backend.models.user import UserRegister, UserLogin

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary")
async def get_analytics(user_id: str = Depends(get_current_user)):
    db = get_db()
    
    # Last 30 days of moods
    cursor = db.moods.find({"user_id": user_id}).sort("date", -1).limit(30)
    moods = [doc async for doc in cursor]
    
    if not moods:
        return {"avg_score": 0, "trend": [], "mood_distribution": {}, "total_entries": 0}
    
    scores = [m["mood_score"] for m in moods]
    avg = round(sum(scores) / len(scores), 1)
    
    # Mood distribution
    distribution = defaultdict(int)
    for m in moods:
        distribution[m["mood_label"]] += 1
    
    # Trend data (date + score)
    trend = [{"date": m["date"], "score": m["mood_score"]} for m in reversed(moods)]
    
    # Journal count
    journal_count = await db.journals.count_documents({"user_id": user_id})
    
    return {
        "avg_score": avg,
        "trend": trend,
        "mood_distribution": dict(distribution),
        "total_mood_entries": len(moods),
        "total_journal_entries": journal_count,
        "best_day": max(moods, key=lambda x: x["mood_score"])["date"],
        "streak": len(moods)  # simplified
    }