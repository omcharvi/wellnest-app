from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from dotenv import load_dotenv
from backend.routes import auth, mood, journal, analytics, chat, reports

load_dotenv()

app = FastAPI()

# ✅ CORS (OPEN TEMPORARY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    return {"status": "running"}