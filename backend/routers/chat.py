from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import ask_fitness_question
import traceback

router = APIRouter()


class LLMRequest(BaseModel):
    user_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/api/chat", response_model=ChatResponse)
def chat(request: LLMRequest):
    """Ask the AI fitness trainer a question based on the user's workout history."""
    try:
        answer = ask_fitness_question(request.user_id, request.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
