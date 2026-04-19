import { useState, useEffect } from 'react'
import { getExerciseDetails } from '../services/api'

function IconArrowLeft() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

export default function ExerciseDetail({ exerciseId, onBack }) {
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!exerciseId) return
    setLoading(true)
    setError('')
    setExercise(null)
    getExerciseDetails(exerciseId)
      .then(res => {
        const data = res.data?.data ?? res.data
        setExercise(data)
      })
      .catch(() => setError('Failed to load exercise details.'))
      .finally(() => setLoading(false))
  }, [exerciseId])

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-black tracking-widest uppercase transition mb-8"
        >
          <IconArrowLeft />
          BACK
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 flex-shrink-0 aspect-square bg-slate-900 border border-slate-800" />
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-slate-900 rounded w-3/4" />
                <div className="h-4 bg-slate-900 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="h-20 bg-slate-900 border border-slate-800" />
                  <div className="h-20 bg-slate-900 border border-slate-800" />
                </div>
                <div className="space-y-3 mt-6">
                  {[1,2,3,4].map(n => <div key={n} className="h-4 bg-slate-900 rounded" />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {exercise && (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — GIF */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="border border-slate-700 bg-slate-900 overflow-hidden aspect-square flex items-center justify-center">
                {exercise.gifUrl ? (
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 border-2 border-slate-700 flex items-center justify-center">
                      <span className="text-slate-600 font-black text-xl">?</span>
                    </div>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">NO IMAGE</p>
                  </div>
                )}
              </div>

              {/* Muscle tags */}
              <div className="mt-4 space-y-3">
                {exercise.targetMuscles?.length > 0 && (
                  <div>
                    <p className="text-slate-600 text-xs font-black uppercase tracking-widest mb-2">PRIMARY</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.targetMuscles.map(m => (
                        <span key={m} className="px-2.5 py-1 bg-red-950 border border-red-900 text-red-400 text-xs font-bold uppercase tracking-wider">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {exercise.secondaryMuscles?.length > 0 && (
                  <div>
                    <p className="text-slate-600 text-xs font-black uppercase tracking-widest mb-2">SECONDARY</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.secondaryMuscles.map(m => (
                        <span key={m} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Info */}
            <div className="flex-1 min-w-0">

              {/* Name + meta */}
              <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none mb-3">
                {exercise.name}
              </h1>

              <div className="grid grid-cols-2 border border-slate-700 mb-8">
                {[
                  { label: 'EQUIPMENT', value: exercise.equipments?.[0] ?? '—' },
                  { label: 'BODY PART', value: exercise.bodyParts?.[0] ?? '—' },
                ].map((s, i) => (
                  <div key={s.label} className={`py-4 px-4 ${i === 0 ? 'border-r border-slate-700' : ''}`}>
                    <p className="text-white font-black text-sm uppercase">{s.value}</p>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              {exercise.instructions?.length > 0 && (
                <div>
                  <h2 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4">
                    HOW TO PERFORM
                  </h2>
                  <ol className="space-y-4">
                    {exercise.instructions.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 bg-red-600 flex items-center justify-center text-white font-black text-xs num">
                          {i + 1}
                        </span>
                        <p className="text-slate-300 text-sm leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
