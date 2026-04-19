import { useState } from 'react'
import { searchExercises } from '../services/api'

const FILTERS = ['ALL', 'COMPOUND', 'ISOLATION', 'CARDIO']

export default function ExerciseSearch({ onViewExercise }) {
  const [query, setQuery]         = useState('')
  const [exercises, setExercises] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [searched, setSearched]   = useState(false)
  const [filter, setFilter]       = useState('ALL')
  const [addedIds, setAddedIds]   = useState(new Set())

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError('')
    try {
      const res = await searchExercises(q, 20)
      setExercises(res.data.exercises ?? [])
      setSearched(true)
    } catch {
      setError('Search failed. Check your connection and try again.')
      setExercises([])
    } finally {
      setLoading(false)
    }
  }

  function handleAdd(exercise) {
    setAddedIds(prev => new Set([...prev, exercise.exerciseId]))
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">EXERCISE LIBRARY</h1>
          <p className="text-slate-500 text-sm font-semibold">SEARCH OVER 1,300 EXERCISES</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 pl-11 pr-4 py-3.5 text-white placeholder-slate-600 text-sm font-semibold focus:outline-none focus:border-red-600 transition"
              placeholder="SEARCH EXERCISES, MUSCLES..."
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs uppercase tracking-widest transition"
          >
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </form>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-black tracking-widest uppercase transition border ${
                filter === f
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="border border-slate-700 animate-pulse">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="flex items-center justify-between px-4 py-4 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-1 h-10 bg-slate-800" />
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-800 rounded w-48" />
                    <div className="h-2.5 bg-slate-800 rounded w-36" />
                  </div>
                </div>
                <div className="h-8 bg-slate-800 rounded w-16" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && exercises.length > 0 && (
          <>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="text-white font-black">{exercises.length}</span> EXERCISES FOUND
            </p>
            <div className="border border-slate-700">
              {exercises.map((ex, idx) => (
                <div
                  key={ex.exerciseId ?? idx}
                  className={`group flex items-center justify-between px-4 py-4 hover:bg-slate-800/40 transition ${idx < exercises.length - 1 ? 'border-b border-slate-800' : ''}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-1 h-10 bg-slate-700 group-hover:bg-red-600 transition flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-white font-black text-sm tracking-wide group-hover:text-red-400 transition uppercase">
                        {ex.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">{ex.equipments?.[0]}</span>
                        {ex.targetMuscles?.[0] && (
                          <>
                            <span className="text-slate-800 text-xs">·</span>
                            <span className="text-slate-600 text-xs font-semibold uppercase">{ex.targetMuscles[0]}</span>
                          </>
                        )}
                        {ex.secondaryMuscles?.length > 0 && (
                          <>
                            <span className="text-slate-800 text-xs">·</span>
                            <span className="text-slate-700 text-xs font-semibold uppercase">{ex.secondaryMuscles.slice(0, 2).join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className="hidden sm:block text-xs font-black text-slate-700 uppercase tracking-widest">{ex.bodyParts?.[0]}</span>
                    <button
                      type="button"
                      onClick={() => onViewExercise?.(ex.exerciseId)}
                      title="Learn more"
                      className="w-8 h-8 flex items-center justify-center border border-slate-700 text-slate-500 hover:text-white hover:border-slate-400 transition text-xs font-black"
                    >
                      i
                    </button>
                    {addedIds.has(ex.exerciseId) ? (
                      <span className="px-4 py-2 text-xs font-black uppercase tracking-wider text-green-500 border border-green-900">
                        ADDED
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(ex)}
                        className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-slate-800 border border-slate-700 hover:bg-red-600 hover:border-red-600 transition"
                      >
                        + ADD
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && searched && exercises.length === 0 && (
          <div className="border border-slate-800 flex flex-col items-center py-16 text-center">
            <p className="text-slate-700 font-black text-4xl mb-3">?</p>
            <p className="text-white font-black text-lg uppercase tracking-wide mb-1">NO RESULTS</p>
            <p className="text-slate-500 text-sm">Try different keywords or check your spelling</p>
          </div>
        )}

        {/* Initial prompt */}
        {!loading && !searched && (
          <div className="border border-dashed border-slate-800 flex flex-col items-center py-16 text-center">
            <p className="text-slate-700 font-black text-sm uppercase tracking-widest">SEARCH TO BROWSE EXERCISES</p>
          </div>
        )}

      </div>
    </div>
  )
}
