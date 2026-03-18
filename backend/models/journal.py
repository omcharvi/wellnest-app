from pydantic import BaseModel
from typing import Optional, List

# 🔹 Request model (when user adds journal)
class JournalEntry(BaseModel):
    date: str
    content: str
    tags: Optional[List[str]] = None


# 🔹 Response model (when sending data back)
class JournalResponse(BaseModel):
    id: str
    user_id: str
    date: str
    content: str
    ai_summary: str
    tags: List[str]