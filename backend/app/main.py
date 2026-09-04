from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import Base, engine
from app.models import Prediction
from app.routes.prediction import router as prediction_router
from app.routes.ai import router as ai_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DisasterGuard LK API",
    description="Sri Lankan disaster risk assessment API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "DisasterGuard LK API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
