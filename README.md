# FITBRO

A fitness tracker and AI personal trainer for beginners.

## What We're Building

FitBro ingests workout and nutrition logs into a RAG (Retrieval-Augmented Generation) pipeline backed by MongoDB Atlas Vector Search, delivering personalized fitness advice through natural-language queries with sub-second retrieval. The frontend is a React app; the backend is a FastAPI service. Deployment targets AWS via CloudFront (static assets) and Elastic Beanstalk (API).

## Tech Stack

**Frontend**
- React 19 + Vite 6
- Tailwind CSS v4

**Backend**
- Python / FastAPI
- MongoDB Atlas (Vector Search for RAG)
- AWS Elastic Beanstalk (API hosting)
- AWS CloudFront (CDN / static hosting)

**AI Pipeline**
- Workout and nutrition logs embedded and stored as vectors in MongoDB Atlas
- Natural-language queries retrieved via Atlas Vector Search
- LLM response generation grounded in the user's own training history

## Project Structure

```
fitbro/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── WorkoutDetail.jsx
│   │   │   ├── WorkoutHistory.jsx
│   │   │   ├── WorkoutLogger.jsx
│   │   │   ├── ExerciseSearch.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── backend/           # FastAPI service
    ├── routers/
    ├── database/
    ├── main.py
    └── requirements.txt
```

## Getting Started

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Status

Work in progress.
