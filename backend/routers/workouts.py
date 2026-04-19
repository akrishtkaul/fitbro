from fastapi import APIRouter, HTTPException
from database.models import Exercise, UpdateExercise, Workout, UpdateWorkout
from database.schema import workouts_collection
from bson import ObjectId
from pymongo import ReturnDocument

router = APIRouter()


@router.post("/api/workouts")
def create_workout(workout: Workout):
        
    try:
        new_workout = workout.model_dump(by_alias=True, exclude=["id"])
        result = workouts_collection.insert_one(new_workout)
        new_workout["_id"] = str(result.inserted_id)
        return new_workout

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/workouts/{workout_id}")
def get_workout(workout_id: str):

    try:
        workout_data = workouts_collection.find_one({"_id": ObjectId(workout_id)})
        if not workout_data:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        return Workout.model_validate(workout_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/api/workouts/{workout_id}")
def update_workout(workout_id: str, workout_update: UpdateWorkout):
    """
    Update a workout (replace exercises array or notes).
    """
    update_data = {
        k: v for k, v in workout_update.model_dump(by_alias=True).items() if v is not None
    }
    
    if len(update_data) < 1:
        workout_data = workouts_collection.find_one({"_id": ObjectId(workout_id)})
        if not workout_data:
            raise HTTPException(status_code=404, detail="Workout not found")
        return Workout.model_validate(workout_data)
    
    try:
        update_result = workouts_collection.find_one_and_update(
            {"_id": ObjectId(workout_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )
        
        if update_result is None:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        return Workout.model_validate(update_result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/workouts/{workout_id}")
def delete_workout(workout_id: str):
    """
    Delete a workout by ID.
    """
    try:
        delete_result = workouts_collection.delete_one({"_id": ObjectId(workout_id)})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        return {"message": "Workout deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/api/workouts/{workout_id}/exercises")
def add_exercise_to_workout(workout_id: str, exercise: Exercise):
    """
    Add a new exercise to an existing workout.
    """
    try:
        result = workouts_collection.find_one_and_update(
            {"_id": ObjectId(workout_id)},
            {"$push": {"exercises": exercise.model_dump()}},
            return_document=ReturnDocument.AFTER
        )
        
        if result is None:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        return Workout.model_validate(result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/api/workouts/{workout_id}/exercises/{exercise_index}")
def update_exercise_in_workout(workout_id: str, exercise_index: int, exercise: Exercise):
    """
    Update a specific exercise in a workout by index (0-based).
    """
    try:
        # Build the update path for the specific array element
        update_field = f"exercises.{exercise_index}"
        
        result = workouts_collection.find_one_and_update(
            {"_id": ObjectId(workout_id)},
            {"$set": {update_field: exercise.model_dump()}},
            return_document=ReturnDocument.AFTER
        )
        
        if result is None:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        return Workout.model_validate(result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/workouts/{workout_id}/exercises/{exercise_index}")
def delete_exercise_from_workout(workout_id: str, exercise_index: int):
    """
    Delete a specific exercise from a workout by index (0-based).
    """
    try:
        # First get the workout
        workout = workouts_collection.find_one({"_id": ObjectId(workout_id)})
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        # Remove the exercise at index
        exercises = workout.get("exercises", [])
        if exercise_index < 0 or exercise_index >= len(exercises):
            raise HTTPException(status_code=400, detail="Invalid exercise index")
        
        exercises.pop(exercise_index)
        
        # Update the workout
        result = workouts_collection.find_one_and_update(
            {"_id": ObjectId(workout_id)},
            {"$set": {"exercises": exercises}},
            return_document=ReturnDocument.AFTER
        )
        
        return Workout.model_validate(result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
