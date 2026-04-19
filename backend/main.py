import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database.schema import users_collection, workouts_collection
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from routers import users, exercises, workouts

app = FastAPI()

app.include_router(users.router)
app.include_router(exercises.router)
app.include_router(workouts.router)

origins = [
    "http://localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to FitBro API!"}

@app.get("/test-db")
def test_db():
    try:
        from database.schema import client
        client.admin.command('ping')
        
        # Count documents
        user_count = users_collection.count_documents({})
        workout_count = workouts_collection.count_documents({})
        
        return {
            "database": "connected",
            "users": user_count,
            "workouts": workout_count
        }
    except Exception as e:
        return {"database": "error", "message": str(e)}

