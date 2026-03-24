from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from dotenv import load_dotenv
from backend.routes import auth, mood, journal, analytics, chat, reports

load_dotenv()

app = FastAPI()

# ✅ Correct CORS configuration
origins = [
    "http://localhost:3000",   # React local
    "http://127.0.0.1:3000",
    "https://your-frontend-url.vercel.app"  # 🔁 replace after deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # ❌ NOT "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(mood.router, prefix="/mood", tags=["Mood"])
app.include_router(journal.router, prefix="/journal", tags=["Journal"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

# ✅ Health check
@app.get("/")
def root():
    return {"status": "running"}