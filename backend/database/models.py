from pydantic import BaseModel, Field, ConfigDict # pyright: ignore[reportMissingImports]
from typing import Annotated, List, Optional
from datetime import datetime, timezone
from pydantic import field_validator
from bson import ObjectId


PyObjectId = Annotated[str, Field(alias="_id")]

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    @field_validator('id', mode='before')
    @classmethod
    def validate_object_id(cls, v):
        if isinstance(v, ObjectId):  # ← Changed from PyObjectId
            return str(v)
        return v
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

class UserUpdate(BaseModel):
    username: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None

class Exercise(BaseModel):
    exercise_id: str
    name: str
    sets: int
    reps: int
    weight: float
    description: Optional[str] = None

class UpdateExercise(BaseModel):
    name: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    description: Optional[str] = None

class Workout(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    exercises: List[Exercise]
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    @field_validator('id', mode='before')  # ← ADD THIS
    @classmethod
    def validate_object_id(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

class UpdateWorkout(BaseModel):
    exercises: Optional[List[Exercise]] = None
    notes: Optional[str] = None