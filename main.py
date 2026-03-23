from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from dotenv import load_dotenv
from backend.routes import auth, mood, journal, analytics, chat, reports

load_dotenv()

app = FastAPI(title="WellNest API", version="1.0.0")

# ✅ CORS (ONLY ONCE, AT TOP)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://wellnest-app-qbab.vercel.app",
        "http://localhost:3005",  # ✅ your current port
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(auth.router)
app.include_router(mood.router)
app.include_router(journal.router)
app.include_router(analytics.router)
app.include_router(chat.router)
app.include_router(reports.router)

# ✅ Root test
@app.get("/")
def root():
    return {"status": "WellNest API running ✅"}