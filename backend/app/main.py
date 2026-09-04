from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import from 'app.routes' matching your folder name
from app.routes.disaster_router import router as disaster_router

load_dotenv()

app = FastAPI(title="Sri Lanka Disaster Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(disaster_router)

@app.get("/")
def root():
    return {"status": "ResQAI Emergency Backend is Running"}