from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from services.ai_service import chat_with_companion
from routes.auth import get_current_user
from backend.models.user import UserRegister, UserLogin
from backend.services.auth_service import hash_password, verify_password, create_access_token, decode_token
from backend.models.mood import MoodLog

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatMessage(BaseModel):
    message: str
    history: List[dict] = []

@router.post("/message")
async def chat(payload: ChatMessage, user_id: str = Depends(get_current_user)):
    reply = chat_with_companion(payload.message, payload.history)
    return {"reply": reply}