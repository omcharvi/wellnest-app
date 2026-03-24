from fastapi import APIRouter, Depends
from backend.models.journal import JournalEntry, JournalResponse
from backend.routes.auth import get_current_user

router = APIRouter()

# 🔹 Add Journal Entry
@router.post("/add", response_model=JournalResponse)
async def add_journal_entry(
    entry: JournalEntry,
    user_id: str = Depends(get_current_user)
):
    # Dummy logic (replace with DB later)
    return {
        "id": "123",
        "user_id": user_id,
        "date": entry.date,
        "content": entry.content,
        "ai_summary": "You felt reflective and thoughtful today.",
        "tags": entry.tags or []
    }