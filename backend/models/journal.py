from pydantic import BaseModel
from typing import Optional, List

class JournalEntry(BaseModel):
    date: str
    content: str
    tags: Optional[List[str]] = []

class JournalResponse(BaseModel):
    id: str
    user_id: str
    date: str
    content: str
    ai_summary: str
    tags: List[str]