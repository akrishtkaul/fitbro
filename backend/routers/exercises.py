from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

EXERCISEDB_BASE_URL = "https://oss.exercisedb.dev/api/v1"

@router.get("/api/exercises/search")
def search_exercises(name: str, limit: int = 10):
    """
    Search for exercises by name using ExerciseDB API.
    """
    try:
        # Get all exercises and filter by name
        response = requests.get(f"{EXERCISEDB_BASE_URL}/exercises",
                                params={"name":name, "limit": limit}
        )

        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"ExerciseDB API error: {response.text}"
            )
        
        exercises = response.json()
        
        data = response.json()
        
        # Return the exercises from the data field
        return {
            "success": data.get("success", False),
            "total": data.get("meta", {}).get("total", 0),
            "exercises": data.get("data", [])
        }
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")

@router.get("/api/exercises/{exercise_id}")
def get_exercise_details(exercise_id: str):
    """
    Get full exercise details (GIF, instructions) by ID.
    """
    try:
        response = requests.get(f"{EXERCISEDB_BASE_URL}/exercises/{exercise_id}")
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Exercise not found"
            )
        
        return response.json()
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
