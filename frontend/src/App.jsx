import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import SignIn from './components/SignIn'
import UserProfile from './components/UserProfile'
import ExerciseSearch from './components/ExerciseSearch'
import WorkoutLogger from './components/WorkoutLogger'
import WorkoutHistory from './components/WorkoutHistory'
import WorkoutDetail from './components/WorkoutDetail'
import ExerciseDetail from './components/ExerciseDetail'

function AppShell() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState('log')
  const [prevPage, setPrevPage] = useState('log')
  const [detailExerciseId, setDetailExerciseId] = useState(null)

  function navigate(target) {
    setPrevPage(page)
    setPage(target)
  }

  function viewExercise(exerciseId) {
    setPrevPage(page)
    setDetailExerciseId(exerciseId)
    setPage('exercise-detail')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-0 select-none">
          <span className="text-white font-black text-4xl tracking-tighter">FIT</span>
          <span className="text-red-500 font-black text-4xl tracking-tighter">BRO</span>
        </div>
      </div>
    )
  }

  if (!user) return <SignIn />

  const pages = {
    log:             <WorkoutLogger onViewExercise={viewExercise} />,
    history:         <WorkoutHistory onNavigate={navigate} />,
    detail:          <WorkoutDetail onNavigate={navigate} />,
    exercises:       <ExerciseSearch onViewExercise={viewExercise} />,
    profile:         <UserProfile />,
    'exercise-detail': (
      <ExerciseDetail
        exerciseId={detailExerciseId}
        onBack={() => navigate(prevPage)}
      />
    ),
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar currentPage={page} onNavigate={navigate} />
      <div className="pt-14">
        {pages[page] ?? pages.log}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
