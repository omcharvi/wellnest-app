from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from backend.routes import auth, mood, journal, analytics, chat, reports

load_dotenv()

app = FastAPI(title="WellNest API", version="1.0.0")

# ✅ CORS - only add ONCE
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://wellnest-app-qbab.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(mood.router)
app.include_router(journal.router)
app.include_router(analytics.router)
app.include_router(chat.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"status": "WellNest API running ✅"}
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Temporary storage (later we use DB)
mood_data = {"mood": "Neutral"}

class Mood(BaseModel):
    mood: str

@app.post("/mood")
def update_mood(m: Mood):
    mood_data["mood"] = m.mood
    return {"message": "Mood updated"}

@app.get("/mood")
def get_mood():
    return mood_data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)