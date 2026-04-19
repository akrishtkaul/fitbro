import { useState, useEffect } from 'react'
import { getUserWorkouts, deleteWorkout } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function IconEdit() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
function IconChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function WorkoutRow({ workout, onDelete, deleting }) {
  const id = workout.id ?? workout._id
  const exerciseCount = workout.exercises?.length ?? 0
  const totalSets = workout.exercises?.reduce((a, e) => a + (e.sets ?? 0), 0) ?? 0
  const totalVolume = workout.exercises?.reduce((a, e) => a + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0), 0) ?? 0
  const date = workout.created_at ? new Date(workout.created_at) : null
  const dateStr = date
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
    : 'N/A'
  const dayStr = date
    ? date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    : ''

  return (
    <div className="group flex items-center border-b border-slate-800 hover:bg-slate-800/40 hover:border-l-2 hover:border-l-red-600 transition-all px-4 py-4">
      <div className="w-16 flex-shrink-0 mr-4">
        <p className="text-white font-black text-sm num leading-none">{dateStr}</p>
        <p className="text-slate-600 text-xs font-bold mt-0.5">{dayStr}</p>
      </div>

      <div className="flex-1 min-w-0 mr-4">
        <p className="text-white font-black text-sm tracking-wide group-hover:text-red-400 transition truncate uppercase">
          {workout.notes ? `WORKOUT` : `WORKOUT`}
        </p>
        {workout.notes && (
          <p className="text-slate-600 text-xs mt-0.5 truncate">{workout.notes}</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-6 mr-4 flex-shrink-0">
        {[
          { value: exerciseCount, label: 'EX' },
          { value: totalSets,     label: 'SETS' },
          { value: Math.round(totalVolume).toLocaleString(), label: 'LBS' },
        ].map(s => (
          <div key={s.label} className="text-right">
            <p className="text-white font-black text-sm num">{s.value}</p>
            <p className="text-slate-600 text-xs uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onDelete(id) }}
          disabled={deleting === id}
          className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-950 disabled:opacity-40 transition"
          title="Delete workout"
        >
          {deleting === id ? (
            <span className="text-xs font-bold">...</span>
          ) : (
            <IconTrash />
          )}
        </button>
        <span className="text-slate-700 group-hover:text-slate-500 transition ml-1">
          <IconChevronRight />
        </span>
      </div>
    </div>
  )
}

export default function WorkoutHistory({ onNavigate }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [deleting, setDeleting] = useState(null)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await getUserWorkouts(user.id)
        setWorkouts(res.data)
      } catch {
        setError('Failed to load workouts. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    fetchWorkouts()
  }, [])

  async function handleDelete(workoutId) {
    setDeleting(workoutId)
    try {
      await deleteWorkout(workoutId)
      setWorkouts(prev => prev.filter(w => (w.id ?? w._id) !== workoutId))
    } catch {
      setError('Failed to delete workout.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = workouts.filter(w => {
    if (!search.trim()) return true
    return (
      w.notes?.toLowerCase().includes(search.toLowerCase()) ||
      w.exercises?.some(e => e.name?.toLowerCase().includes(search.toLowerCase()))
    )
  })

  const totalVolume = workouts.reduce((sum, w) =>
    sum + (w.exercises?.reduce((a, e) => a + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0), 0) ?? 0), 0)

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">HISTORY</h1>
            <p className="text-slate-500 text-sm font-semibold">
              {loading ? '...' : `${workouts.length} WORKOUTS LOGGED`}
            </p>
          </div>
          <button type="button" onClick={() => onNavigate?.('log')} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase transition">
            + NEW WORKOUT
          </button>
        </div>

        {/* Summary */}
        {!loading && workouts.length > 0 && (
          <div className="grid grid-cols-3 border border-slate-700 mb-6">
            {[
              { value: workouts.length,                          label: 'TOTAL' },
              { value: workouts.reduce((a, w) => a + (w.exercises?.reduce((b, e) => b + (e.sets ?? 0), 0) ?? 0), 0), label: 'TOTAL SETS' },
              { value: Math.round(totalVolume).toLocaleString(), label: 'TOTAL LBS' },
            ].map((s, i) => (
              <div key={s.label} className={`py-4 px-4 ${i < 2 ? 'border-r border-slate-700' : ''}`}>
                <p className="text-2xl font-black text-white num leading-none mb-1">{s.value}</p>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 pl-9 pr-4 py-2.5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-slate-500 transition"
            placeholder="SEARCH WORKOUTS..."
          />
        </div>

        {/* Table header */}
        {!loading && workouts.length > 0 && (
          <div className="flex items-center border-b border-slate-700 bg-slate-900/50 px-4 py-2">
            <div className="w-16 mr-4 text-xs font-black text-slate-600 uppercase tracking-widest">DATE</div>
            <div className="flex-1 text-xs font-black text-slate-600 uppercase tracking-widest">WORKOUT</div>
            <div className="hidden sm:flex items-center gap-6 mr-4">
              {['EX', 'SETS', 'LBS'].map(h => (
                <div key={h} className="w-12 text-right text-xs font-black text-slate-600 uppercase tracking-widest">{h}</div>
              ))}
            </div>
            <div className="w-16" />
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="border-x border-slate-800 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex items-center gap-4 px-4 py-4 border-b border-slate-800">
                <div className="w-16 space-y-1.5">
                  <div className="h-3 bg-slate-800 rounded w-12" />
                  <div className="h-2.5 bg-slate-800 rounded w-8" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-800 rounded w-40" />
                  <div className="h-2.5 bg-slate-800 rounded w-56" />
                </div>
                <div className="hidden sm:flex gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="h-6 bg-slate-800 rounded w-10" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.length > 0 && (
          <div className="border-x border-slate-800">
            {filtered.map(w => (
              <WorkoutRow key={w.id ?? w._id} workout={w} onDelete={handleDelete} deleting={deleting} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && workouts.length === 0 && (
          <div className="border border-slate-800 flex flex-col items-center py-20 text-center">
            <p className="text-slate-700 font-black text-5xl mb-4">0</p>
            <p className="text-white font-black text-xl uppercase tracking-wide mb-2">NO WORKOUTS YET</p>
            <p className="text-slate-500 text-sm">Log your first session to start tracking</p>
          </div>
        )}

        {/* No search results */}
        {!loading && workouts.length > 0 && filtered.length === 0 && (
          <div className="border border-slate-800 flex flex-col items-center py-12 text-center">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">NO WORKOUTS MATCH YOUR SEARCH</p>
          </div>
        )}

      </div>
    </div>
  )
}
