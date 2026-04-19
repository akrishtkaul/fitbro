import Navbar from './components/Navbar'
import UserProfile from './components/UserProfile'
import ExerciseSearch from './components/ExerciseSearch'
import WorkoutLogger from './components/WorkoutLogger'
import WorkoutHistory from './components/WorkoutHistory'
import WorkoutDetail from './components/WorkoutDetail'

const SECTIONS = [
  { id: 'detail',    label: 'WorkoutDetail.jsx',    component: <WorkoutDetail /> },
  { id: 'history',   label: 'WorkoutHistory.jsx',   component: <WorkoutHistory /> },
  { id: 'log',       label: 'WorkoutLogger.jsx',     component: <WorkoutLogger /> },
  { id: 'exercises', label: 'ExerciseSearch.jsx',    component: <ExerciseSearch /> },
  { id: 'profile',   label: 'UserProfile.jsx',       component: <UserProfile /> },
]

export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <div className="pt-14">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-4 py-2">
              <span className="text-xs font-mono text-slate-700">— {s.label}</span>
            </div>
            {s.component}
          </section>
        ))}
      </div>
    </div>
  )
}
