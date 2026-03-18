from pydantic import BaseModel
from typing import Optional, List

# 🔹 Request model
class JournalEntry(BaseModel):
    date: str
    content: str
    tags: Optional[List[str]] = None

# 🔹 Response model
class JournalResponse(BaseModel):
    id: str
    user_id: str
    date: str
    content: str
    ai_summary: str
    tags: List[str]