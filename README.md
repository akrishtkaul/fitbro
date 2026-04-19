# FITBRO

A gym tracking app with an AI coach that actually knows your training history.

---

## What It Does (MVP)

FitBro is a full-stack fitness tracker with a built-in AI trainer. You log workouts, browse exercises, and ask your AI coach questions — it reads your real data before answering.

**Authentication**
Username-only sign-in. Your account is created automatically on first visit and persists across sessions.

**Workout Logging**
Search 1,300+ exercises, build a session with sets/reps/weight, add notes, and save. Draft auto-saves locally so navigating away never loses your work.

**Workout History**
Full log of past sessions with date, volume, and set totals. Search by exercise or notes. Delete any entry inline.

**Workout Detail**
Drill into any workout. Edit or remove individual exercises. Jump between sessions from a picker.

**Exercise Library**
Search exercises by name. Every result has an info page with an animated GIF demo, step-by-step instructions, primary/secondary muscles targeted, and equipment needed.

**AI Trainer**
A slide-in chat panel powered by GPT-4o mini. Before responding, it fetches your full workout history from the database and uses it as context — so answers reference your actual training, not generic advice.

**Profile**
Edit your username, height, weight, and age.

---

## Tech Stack

**Frontend**
- React 19 + Vite 6
- Tailwind CSS v4
- Axios

**Backend**
- Python + FastAPI
- MongoDB Atlas (PyMongo)
- OpenAI API (GPT-4o mini)

**External**
- ExerciseDB OSS API — exercise data and GIFs

---

## Project Structure

```
fitbro/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── SignIn.jsx
│       │   ├── WorkoutLogger.jsx
│       │   ├── WorkoutHistory.jsx
│       │   ├── WorkoutDetail.jsx
│       │   ├── ExerciseSearch.jsx
│       │   ├── ExerciseDetail.jsx
│       │   ├── UserProfile.jsx
│       │   └── TrainerPanel.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       └── main.jsx
└── backend/
    ├── routers/
    │   ├── users.py
    │   ├── workouts.py
    │   ├── exercises.py
    │   └── chat.py
    ├── services/
    │   └── llm_service.py
    ├── database/
    │   ├── models.py
    │   └── schema.py
    ├── main.py
    └── requirements.txt
```

---

## Getting Started

**1. Environment**

Create `backend/.env`:
```
MONGO_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_key
```

**2. Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8000`.

---

## Roadmap

The MVP proves the core loop: log → analyze → advise. Here's where it goes next.

| Priority | Feature |
|----------|---------|
| 1 | Real authentication — passwords, JWT, multi-device sessions |
| 2 | Personal records — auto-detect PRs, show last session's numbers while logging |
| 3 | Progress charts — volume over time, strength curves per exercise |
| 4 | Workout templates — save, reuse, and follow structured programs |
| 5 | AI trainer memory — persist chat history, streaming responses |
| 6 | Streaks and reminders — rest day alerts, weekly summaries |
| 7 | Social layer — share workouts, follow friends, leaderboards |

**End goal:** the training intelligence layer that makes every session smarter than the last — a coach that knows your history, spots your weaknesses, and programs around your life.
