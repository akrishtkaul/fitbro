import { useState, useRef, useEffect } from 'react'
import { searchExercises, createWorkout } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const DRAFT_KEY = 'fitbro_workout_draft'

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function ExerciseBlock({ exercise, index, onChange, onRemove }) {
  return (
    <div className="border border-slate-700 bg-slate-900 mb-4">
      <div className="border-l-4 border-red-600 flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div>
          <p className="text-white font-black text-sm tracking-wide uppercase">{exercise.name}</p>
          {exercise.target && (
            <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mt-0.5">{exercise.target}</p>
          )}
        </div>
        <button type="button" onClick={() => onRemove(index)} className="flex items-center gap-1.5 text-red-500 hover:text-white hover:bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider border border-red-900 hover:border-red-600 transition">
          <IconTrash />
          REMOVE
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <div className="text-xs font-black text-slate-600 uppercase tracking-widest">SETS</div>
        <div className="text-xs font-black text-slate-600 uppercase tracking-widest">REPS</div>
        <div className="text-xs font-black text-slate-600 uppercase tracking-widest">WEIGHT (LBS)</div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {['sets', 'reps', 'weight'].map(field => (
          <input
            key={field}
            type="number"
            min="0"
            step={field === 'weight' ? '0.5' : '1'}
            value={exercise[field]}
            onChange={e => onChange(index, field, e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 px-3 py-2.5 text-white font-black text-base num text-center focus:outline-none focus:border-red-600 transition"
            placeholder="0"
          />
        ))}
      </div>
    </div>
  )
}

export default function WorkoutLogger({ onViewExercise }) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery]     = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showDropdown, setShowDropdown]   = useState(false)
  const [exercises, setExercises]         = useState(() => loadDraft()?.exercises ?? [])
  const [notes, setNotes]                 = useState(() => loadDraft()?.notes ?? '')
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState('')
  const [success, setSuccess]             = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (exercises.length > 0 || notes) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ exercises, notes }))
    } else {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [exercises, notes])

  function clearDraft() {
    setExercises([])
    setNotes('')
    localStorage.removeItem(DRAFT_KEY)
  }

  function handleSearchChange(e) {
    const q = e.target.value
    setSearchQuery(q)

    clearTimeout(debounceRef.current)

    if (!q.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchExercises(q.trim(), 6)
        setSearchResults(res.data.exercises ?? [])
        setShowDropdown(true)
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 500)
  }

  function handleAddExercise(ex) {
    setExercises(prev => [
      ...prev,
      { exercise_id: ex.exerciseId, name: ex.name, target: ex.targetMuscles?.[0] ?? '', sets: 3, reps: 10, weight: 0 },
    ])
    setSearchQuery('')
    setSearchResults([])
    setShowDropdown(false)
  }

  function handleExerciseChange(index, field, value) {
    setExercises(prev => prev.map((ex, i) =>
      i === index ? { ...ex, [field]: field === 'weight' ? parseFloat(value) || 0 : parseInt(value) || 0 } : ex
    ))
  }

  function handleRemoveExercise(index) {
    setExercises(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (exercises.length === 0) { setError('Add at least one exercise before saving.'); return }
    setSaving(true)
    setError('')
    try {
      await createWorkout({
        user_id: user.id,
        exercises: exercises.map(({ exercise_id, name, sets, reps, weight }) => ({
          exercise_id,
          name,
          sets,
          reps,
          weight,
        })),
        notes,
      })
      setSuccess(true)
      clearDraft()
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Failed to save workout. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const totalVolume = exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * ex.weight, 0)
  const totalSets   = exercises.reduce((sum, ex) => sum + ex.sets, 0)

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">LOG WORKOUT</h1>
            <p className="text-slate-500 text-sm font-semibold">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Draft restored notice */}
        {exercises.length > 0 && !success && (
          <div className="bg-slate-800/60 border-l-4 border-slate-600 px-4 py-2 mb-4 flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold">DRAFT RESTORED — {exercises.length} EXERCISE{exercises.length !== 1 ? 'S' : ''}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-slate-800 border-l-4 border-green-500 px-4 py-3 mb-6">
            <p className="text-green-400 text-sm font-semibold">WORKOUT SAVED SUCCESSFULLY!</p>
          </div>
        )}

        {/* Exercise search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            className="w-full bg-slate-900 border border-slate-700 pl-11 pr-4 py-3 text-white placeholder-slate-600 text-sm font-semibold focus:outline-none focus:border-red-600 transition"
            placeholder={searchLoading ? 'SEARCHING...' : 'SEARCH AND ADD EXERCISES...'}
          />

          {/* Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 border border-slate-700 bg-slate-900 shadow-2xl">
              {searchResults.map(ex => (
                <div
                  key={ex.exerciseId}
                  className="flex items-center justify-between px-4 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-bold text-sm uppercase tracking-wide truncate">{ex.name}</p>
                    <p className="text-slate-600 text-xs uppercase tracking-wider mt-0.5">
                      {ex.equipments?.[0]} · {ex.targetMuscles?.[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <button
                      type="button"
                      onMouseDown={() => onViewExercise?.(ex.exerciseId)}
                      title="Learn more"
                      className="w-7 h-7 flex items-center justify-center border border-slate-600 text-slate-500 hover:text-white hover:border-slate-400 transition text-xs font-black"
                    >
                      i
                    </button>
                    <button
                      type="button"
                      onMouseDown={() => handleAddExercise(ex)}
                      className="text-red-500 hover:text-white font-black text-lg leading-none px-1 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Added exercises */}
        {exercises.length > 0 ? (
          exercises.map((ex, idx) => (
            <ExerciseBlock
              key={`${ex.exercise_id}-${idx}`}
              exercise={ex}
              index={idx}
              onChange={handleExerciseChange}
              onRemove={handleRemoveExercise}
            />
          ))
        ) : (
          <div className="border border-dashed border-slate-800 flex flex-col items-center py-12 text-center mb-6">
            <p className="text-slate-700 font-black text-4xl mb-3">0</p>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-1">NO EXERCISES ADDED</p>
            <p className="text-slate-600 text-xs">Search above to add exercises</p>
          </div>
        )}

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">NOTES</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-red-600 transition resize-none"
            placeholder="How did it go? Any notes?"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 border border-slate-700 mb-6">
          {[
            { label: 'EXERCISES', value: exercises.length },
            { label: 'TOTAL SETS', value: totalSets },
            { label: 'VOLUME (LBS)', value: totalVolume.toLocaleString() },
          ].map((s, i) => (
            <div key={s.label} className={`py-3 px-4 ${i < 2 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-white font-black text-xl num leading-none">{s.value}</p>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || exercises.length === 0}
          className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black uppercase tracking-widest text-sm transition mb-3"
        >
          {saving ? 'SAVING...' : 'FINISH WORKOUT'}
        </button>
        <button
          type="button"
          onClick={() => { clearDraft(); setError('') }}
          className="w-full py-2 text-slate-600 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition text-center"
        >
          DISCARD WORKOUT
        </button>

      </div>
    </div>
  )
}
