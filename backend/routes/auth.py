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

# 🔹 Router setup
router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

# 🔴 Load Mongo URI
MONGO_URI = os.getenv("MONGO_URI")

# 🔴 Check if env variable exists
if not MONGO_URI:
    raise Exception("❌ MONGO_URI is NOT set in environment variables")

print("✅ MONGO_URI loaded:", MONGO_URI)

# 🔹 MongoDB client (with TLS for Atlas)
client = AsyncIOMotorClient(MONGO_URI, tls=True)

# 🔹 Get database
def get_db():
    return client["wellnest"]


# 🔹 Get current user from token
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


# 🔹 Register API
@router.post("/register")
async def register(user: UserRegister):
    try:
        db = get_db()

        # Check if user already exists
        existing = await db.users.find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create user document
        user_doc = {
            "email": user.email,
            "name": user.name,
            "password_hash": hash_password(user.password),
            "created_at": datetime.utcnow()
        }

        # Insert into DB
        result = await db.users.insert_one(user_doc)

        # Create token
        token = create_access_token(str(result.inserted_id))

        return {
            "token": token,
            "name": user.name,
            "email": user.email
        }

    except Exception as e:
        print("❌ Register Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


# 🔹 Login API
@router.post("/login")
async def login(user: UserLogin):
    try:
        db = get_db()

        # Find user
        found = await db.users.find_one({"email": user.email})

        if not found or not verify_password(user.password, found["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Create token
        token = create_access_token(str(found["_id"]))

        return {
            "token": token,
            "name": found["name"],
            "email": found["email"]
        }

    except Exception as e:
        print("❌ Login Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")