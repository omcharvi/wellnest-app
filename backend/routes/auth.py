from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from models.user import UserRegister, UserLogin
from services.auth_service import hash_password, verify_password, create_access_token, decode_token
from datetime import datetime
import os

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

def get_db():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    return client.wellnest

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_id = decode_token(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id

@router.post("/register")
async def register(user: UserRegister):
    db = get_db()
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "email": user.email,
        "name": user.name,
        "password_hash": hash_password(user.password),
        "created_at": datetime.utcnow()
    }
    result = await db.users.insert_one(user_doc)
    token = create_access_token(str(result.inserted_id))
    return {"token": token, "name": user.name, "email": user.email}

@router.post("/login")
async def login(user: UserLogin):
    db = get_db()
    found = await db.users.find_one({"email": user.email})
    if not found or not verify_password(user.password, found["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(str(found["_id"]))
    return {"token": token, "name": found["name"], "email": found["email"]}