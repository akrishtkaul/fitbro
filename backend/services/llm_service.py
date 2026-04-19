from openai import OpenAI
from database.schema import workouts_collection
import os


def get_user_workouts(user_id: str) -> list:
    """Fetch all workouts for a user from MongoDB, sorted newest first."""
    workouts = list(workouts_collection.find({"user_id": user_id}).sort("created_at", -1))
    for w in workouts:
        w.pop("_id", None)
    return workouts


def format_workouts_to_text(workouts: list) -> str:
    """Convert workout documents into a readable string for the LLM context."""
    if not workouts:
        return "No workout history found for this user."

    lines = []
    for workout in workouts:
        date = workout.get("created_at", "Unknown date")
        notes = workout.get("notes", "")
        exercises = workout.get("exercises", [])

        lines.append(f"\n--- Workout on {date} ---")
        if not exercises:
            lines.append("  (no exercises recorded)")
        for ex in exercises:
            lines.append(
                f"  • {ex.get('name', 'Unknown')}: "
                f"{ex.get('sets', '?')} sets × {ex.get('reps', '?')} reps "
                f"@ {ex.get('weight', '?')} lbs"
            )
        if notes:
            lines.append(f"  Notes: {notes}")

    return "\n".join(lines)


def ask_fitness_question(user_id: str, question: str) -> str:
    """Run the full RAG pipeline: fetch workouts → format → call LLM → return answer."""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    workouts = get_user_workouts(user_id)
    context = format_workouts_to_text(workouts)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a concise, no-nonsense fitness coach. "
                    "Answer in 3-5 bullet points max. No long paragraphs. No filler phrases. "
                    "Be direct and specific — reference the user's actual workout data when relevant. "
                    "Use bold for key terms. Keep the whole response under 150 words."
                ),
            },
            {
                "role": "user",
                "content": f"Here is my workout history:\n{context}\n\nMy question: {question}",
            },
        ],
    )

    return response.choices[0].message.content
