from fastapi import APIRouter, HTTPException
from database.models import User, UserUpdate, Workout
from database.schema import users_collection, workouts_collection
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError
from pydantic import BaseModel
from bson import ObjectId

router = APIRouter()

class LoginRequest(BaseModel):
    username: str

@router.post("/api/auth/login", response_model=User, response_model_by_alias=False)
def login(body: LoginRequest):
    username = body.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required.")
    user = users_collection.find_one({"username": username})
    if not user:
        new_user = User(username=username)
        user_dict = new_user.model_dump(by_alias=True, exclude=["id"])
        result = users_collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        user = user_dict
    return User.model_validate(user)

@router.post("/api/users")
def create_user(user: User ):
    """
    Create a New User for This app.
    """
    try:
        user_dict = user.model_dump(by_alias=True, exclude=["id"])
        result = users_collection.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)

        return user_dict
    
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Username already exists.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/users/{id}",
            response_description="Get User Information by ID",
            response_model=User,
            response_model_by_alias=False,
)
def get_user(id: str):
    """
    Get User Information by ID.
    """
    try:
        user_data = users_collection.find_one({"_id": ObjectId(id)})
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found.")
        
        return User.model_validate(user_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/users",
            response_description="Get all users",
            response_model=list[User],
            response_model_by_alias=False,
)
def get_all_users():
    """
    Get all users in the system.
    """
    try:
        users = list(users_collection.find())
        return [User.model_validate(user) for user in users]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/users/{id}",
            response_description="Update a User",
            response_model=User,
            response_model_by_alias=False,
)
def update_user(id: str, user: UserUpdate):
    """
    Update Information of A User
    """
    update_data = {
        k: v for k, v in user.model_dump(by_alias=True).items() if v is not None
    }

    if len(update_data) < 1:
        # No updates, return current user
        user_data = users_collection.find_one({"_id": ObjectId(id)})
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        return User.model_validate(user_data)

    try:
        update_result = users_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )

        if update_result is None:
            raise HTTPException(status_code=404, detail="User not found")
            
        return User.model_validate(update_result)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/users/{id}", response_description="Delete a User",)
def delete_user(id: str):
    """
    Delete a User by ID.
    """
    try:
        delete_result = users_collection.delete_one({"_id": ObjectId(id)})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found.")
        return {"message": "User deleted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/api/users/{user_id}/workouts",
    response_description="Get all workouts for a user",
    response_model=list[Workout],
    response_model_by_alias=False,
)
def get_user_workouts(user_id: str):
    """Return all workouts for a user, sorted newest first."""
    try:
        workouts = list(
            workouts_collection.find({"user_id": user_id}).sort("created_at", -1)
        )
        return [Workout.model_validate(w) for w in workouts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
