from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from backend.models.user import UserRegister, UserLogin
from backend.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token
)
from datetime import datetime
import os

# Router setup
router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

# Load Mongo URI
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("❌ MONGO_URI not set")

print("✅ MongoDB Connected")

# MongoDB client (IMPORTANT FIX: remove tls=True)
client = AsyncIOMotorClient(MONGO_URI)

# Get DB
def get_db():
    return client["wellnest"]


# Get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        user_id = decode_token(credentials.credentials)
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# REGISTER API
@router.post("/register")
async def register(user: UserRegister):
    db = get_db()

    try:
        # Check existing user
        existing = await db.users.find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Insert user
        user_doc = {
            "email": user.email,
            "name": user.name,
            "password_hash": hash_password(user.password),
            "created_at": datetime.utcnow()
        }

        result = await db.users.insert_one(user_doc)

        # Token
        token = create_access_token(str(result.inserted_id))

        return {
            "token": token,
            "name": user.name,
            "email": user.email
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ REGISTER ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# LOGIN API
@router.post("/login")
async def login(user: UserLogin):
    db = get_db()

    try:
        found = await db.users.find_one({"email": user.email})

        if not found:
            raise HTTPException(status_code=401, detail="User not found")

        if not verify_password(user.password, found["password_hash"]):
            raise HTTPException(status_code=401, detail="Wrong password")

        token = create_access_token(str(found["_id"]))

        return {
            "token": token,
            "name": found["name"],
            "email": found["email"]
        }

    except HTTPException:
        raise
    except Exception as e:
        print("❌ LOGIN ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))