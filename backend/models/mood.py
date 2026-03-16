
from pydantic import BaseModel
from typing import Optional
from datetime import date

class MoodLog(BaseModel):
    date: str           # YYYY-MM-DD
    mood_score: int     # 1-10
    mood_label: str     # happy/sad/anxious/neutral/other
    notes: Optional[str] = ""

class MoodResponse(BaseModel):
    id: str
    user_id: str
    date: str
    mood_score: int
    mood_label: str
    notes: str