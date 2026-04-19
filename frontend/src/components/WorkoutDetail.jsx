import { useState, useEffect } from 'react'
import {
  getUserWorkouts,
  deleteWorkout,
  deleteExerciseFromWorkout,
  updateExerciseInWorkout,
} from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function IconEdit()  { return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> }
function IconTrash() { return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> }
function IconArrowLeft() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg> }

function ExerciseCard({ exercise, index, workoutId, onUpdated, onDeleted }) {
  const [editing, setEditing]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({
    exercise_id: exercise.exercise_id,
    name:        exercise.name,
    sets:        exercise.sets,
    reps:        exercise.reps,
    weight:      exercise.weight,
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await updateExerciseInWorkout(workoutId, index, {
        exercise_id: form.exercise_id,
        name:        form.name,
        sets:        parseInt(form.sets)    || 0,
        reps:        parseInt(form.reps)    || 0,
        weight:      parseFloat(form.weight) || 0,
      })
      onUpdated(res.data)
      setEditing(false)
    } catch {
      setError('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove() {
    setRemoving(true)
    try {
      const res = await deleteExerciseFromWorkout(workoutId, index)
      onDeleted(res.data)
    } catch {
      setError('Failed to remove exercise.')
      setRemoving(false)
    }
  }

  return (
    <div className="border border-slate-700 bg-slate-900">
      {/* Header */}
      <div className="border-l-4 border-red-600">
        <div className="flex items-start justify-between px-4 py-4 border-b border-slate-700">
          <div>
            <h3 className="text-white font-black text-sm tracking-wide uppercase">{exercise.name}</h3>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => { setEditing(!editing); setError('') }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition"
            >
              <IconEdit />
              {editing ? 'CANCEL' : 'EDIT'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider text-red-500 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-40 transition"
            >
              <IconTrash />
              {removing ? '...' : 'REMOVE'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-slate-700 bg-slate-800/40">
          {[
            { label: 'SETS',   value: exercise.sets   },
            { label: 'REPS',   value: exercise.reps   },
            { label: 'WEIGHT', value: `${exercise.weight} LBS` },
          ].map((s, i) => (
            <div key={s.label} className={`px-4 py-3 ${i < 2 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-white font-black text-base num leading-none">{s.value}</p>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="p-4 border-t border-slate-800 bg-slate-800/20">
          {error && <p className="text-red-400 text-xs mb-3 font-semibold">{error}</p>}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { name: 'sets',   label: 'SETS',   step: '1'   },
              { name: 'reps',   label: 'REPS',   step: '1'   },
              { name: 'weight', label: 'WEIGHT', step: '0.5' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-1">{f.label}</label>
                <input
                  name={f.name}
                  type="number"
                  step={f.step}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 text-white font-black text-sm num text-center focus:outline-none focus:border-red-600 transition"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-black text-xs uppercase tracking-widest transition"
          >
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function WorkoutDetail({ onNavigate }) {
  const { user } = useAuth()
  const [workout, setWorkout]   = useState(null)
  const [workouts, setWorkouts] = useState([])  // for picker
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await getUserWorkouts(user.id)
        const list = res.data
        setWorkouts(list)
        if (list.length > 0) setWorkout(list[0])
      } catch {
        setError('Failed to load workout. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    fetchLatest()
  }, [])

  async function handleDeleteWorkout() {
    if (!workout) return
    const id = workout.id ?? workout._id
    setDeleting(true)
    try {
      await deleteWorkout(id)
      const remaining = workouts.filter(w => (w.id ?? w._id) !== id)
      setWorkouts(remaining)
      setWorkout(remaining[0] ?? null)
    } catch {
      setError('Failed to delete workout.')
    } finally {
      setDeleting(false)
    }
  }

  function handleExerciseUpdated(updatedWorkout) {
    setWorkout(updatedWorkout)
  }

  function handleExerciseDeleted(updatedWorkout) {
    setWorkout(updatedWorkout)
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
          <div className="h-12 bg-slate-900 border border-slate-800 w-48" />
          <div className="h-32 bg-slate-900 border border-slate-800" />
          <div className="h-24 bg-slate-900 border border-slate-800" />
          <div className="h-48 bg-slate-900 border border-slate-800" />
        </div>
      </div>
    )
  }

  const workoutId = workout?.id ?? workout?._id
  const totalSets = workout?.exercises?.reduce((a, e) => a + (e.sets ?? 0), 0) ?? 0
  const totalReps = workout?.exercises?.reduce((a, e) => a + (e.sets ?? 0) * (e.reps ?? 0), 0) ?? 0
  const totalVolume = workout?.exercises?.reduce((a, e) => a + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0), 0) ?? 0
  const date = workout?.created_at ? new Date(workout.created_at) : null
  const dateStr = date
    ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'N/A'

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back + workout picker */}
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={() => onNavigate?.('history')} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-black tracking-widest uppercase transition">
            <IconArrowLeft />
            HISTORY
          </button>

          {workouts.length > 1 && (
            <select
              value={workoutId}
              onChange={e => setWorkout(workouts.find(w => (w.id ?? w._id) === e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-400 px-3 py-1.5 text-xs font-bold uppercase focus:outline-none focus:border-red-600 cursor-pointer"
            >
              {workouts.map(w => {
                const wId = w.id ?? w._id
                const wDate = w.created_at ? new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : 'N/A'
                return <option key={wId} value={wId}>{wDate} — {w.exercises?.length ?? 0} EXERCISES</option>
              })}
            </select>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* No workouts */}
        {!workout && !error && (
          <div className="border border-slate-800 flex flex-col items-center py-20 text-center">
            <p className="text-slate-700 font-black text-5xl mb-4">0</p>
            <p className="text-white font-black text-xl uppercase tracking-wide mb-2">NO WORKOUTS LOGGED</p>
            <p className="text-slate-500 text-sm">Log a workout to see it here</p>
          </div>
        )}

        {workout && (
          <>
            {/* Workout header */}
            <div className="bg-slate-900 border border-slate-700 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 border-b border-slate-700">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">{dateStr}</p>
                  <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                    WORKOUT
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteWorkout}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-black tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-red-700 transition"
                  >
                    <IconTrash />
                    {deleting ? 'DELETING...' : 'DELETE'}
                  </button>
                </div>
              </div>

              {/* Overall stats */}
              <div className="grid grid-cols-4">
                {[
                  { value: workout.exercises?.length ?? 0, label: 'EXERCISES' },
                  { value: totalSets,                       label: 'SETS' },
                  { value: totalReps,                       label: 'REPS' },
                  { value: Math.round(totalVolume).toLocaleString(), label: 'VOLUME LBS' },
                ].map((s, i) => (
                  <div key={s.label} className={`py-4 px-3 text-center ${i < 3 ? 'border-r border-slate-700' : ''}`}>
                    <p className="text-2xl font-black text-white num leading-none mb-1">{s.value}</p>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {workout.notes && (
                <div className="border-t border-slate-700 px-6 py-4">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">NOTES</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{workout.notes}</p>
                </div>
              )}
            </div>

            {/* Exercise cards */}
            <div className="space-y-4 mb-6">
              {workout.exercises?.length > 0 ? (
                workout.exercises.map((ex, idx) => (
                  <ExerciseCard
                    key={`${ex.exercise_id}-${idx}`}
                    exercise={ex}
                    index={idx}
                    workoutId={workoutId}
                    onUpdated={handleExerciseUpdated}
                    onDeleted={handleExerciseDeleted}
                  />
                ))
              ) : (
                <div className="border border-dashed border-slate-800 flex flex-col items-center py-12 text-center">
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">NO EXERCISES IN THIS WORKOUT</p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm transition"
            >
              REPEAT THIS WORKOUT
            </button>
          </>
        )}

      </div>
    </div>
  )
}
