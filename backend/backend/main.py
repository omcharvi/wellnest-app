from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from dotenv import load_dotenv
from backend.routes import auth, mood, journal, analytics, chat, reports

load_dotenv()

app = FastAPI()

# ✅ FINAL WORKING CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # NOT "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DEBUG (must appear in logs)
print("🔥 CORS ACTIVE")

# Routes
app.include_router(auth.router, prefix="/auth")
app.include_router(mood.router, prefix="/mood")
app.include_router(journal.router, prefix="/journal")
app.include_router(analytics.router, prefix="/analytics")
app.include_router(chat.router, prefix="/chat")
app.include_router(reports.router, prefix="/reports")

@app.get("/")
def root():
    return {"status": "running"}