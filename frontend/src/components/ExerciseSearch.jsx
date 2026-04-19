const EXERCISES = [
  { id: 1, name: 'BARBELL BENCH PRESS',    equipment: 'BARBELL',       muscles: ['CHEST', 'TRICEPS', 'FRONT DELTS'], category: 'COMPOUND' },
  { id: 2, name: 'PULL-UP',                equipment: 'BODYWEIGHT',    muscles: ['LATS', 'BICEPS', 'REAR DELTS'],    category: 'COMPOUND' },
  { id: 3, name: 'BARBELL SQUAT',          equipment: 'BARBELL',       muscles: ['QUADS', 'GLUTES', 'HAMSTRINGS'],   category: 'COMPOUND' },
  { id: 4, name: 'ROMANIAN DEADLIFT',      equipment: 'BARBELL',       muscles: ['HAMSTRINGS', 'GLUTES', 'BACK'],    category: 'COMPOUND' },
  { id: 5, name: 'CABLE LATERAL RAISE',   equipment: 'CABLE',         muscles: ['SIDE DELTS'],                      category: 'ISOLATION' },
  { id: 6, name: 'OVERHEAD PRESS',         equipment: 'BARBELL',       muscles: ['SHOULDERS', 'TRICEPS', 'CORE'],    category: 'COMPOUND' },
  { id: 7, name: 'BARBELL ROW',            equipment: 'BARBELL',       muscles: ['LATS', 'RHOMBOIDS', 'BICEPS'],     category: 'COMPOUND' },
  { id: 8, name: 'INCLINE DUMBBELL PRESS', equipment: 'DUMBBELL',      muscles: ['UPPER CHEST', 'FRONT DELTS'],      category: 'COMPOUND' },
]

const FILTERS = ['ALL', 'COMPOUND', 'ISOLATION', 'CARDIO']
const EQUIPMENT = ['ANY', 'BARBELL', 'DUMBBELL', 'CABLE', 'BODYWEIGHT', 'MACHINE']

export default function ExerciseSearch() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">EXERCISE LIBRARY</h1>
          <p className="text-slate-500 text-sm font-semibold">BROWSE AND ADD TO YOUR WORKOUT</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            defaultValue="bench"
            className="w-full bg-slate-900 border border-slate-700 pl-11 pr-4 py-3.5 text-white placeholder-slate-600 text-sm font-semibold focus:outline-none focus:border-red-600 transition"
            placeholder="SEARCH EXERCISES, MUSCLES..."
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`px-4 py-1.5 text-xs font-black tracking-widest uppercase transition border ${
                i === 0
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Equipment filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {EQUIPMENT.map((eq, i) => (
            <button
              key={eq}
              type="button"
              className={`whitespace-nowrap px-3 py-1 text-xs font-bold tracking-wider uppercase transition ${
                i === 0 ? 'text-white bg-slate-700' : 'text-slate-600 hover:text-slate-300'
              }`}
            >
              {eq}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
            <span className="text-white font-black">8</span> EXERCISES
          </p>
        </div>

        {/* Exercise list */}
        <div className="border border-slate-700">
          {EXERCISES.map((ex, idx) => (
            <div
              key={ex.id}
              className={`group flex items-center justify-between px-4 py-4 hover:bg-slate-800/40 transition ${idx < EXERCISES.length - 1 ? 'border-b border-slate-800' : ''}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Category marker */}
                <div className="w-1 h-10 bg-slate-700 group-hover:bg-red-600 transition flex-shrink-0" />

                <div className="min-w-0">
                  <h3 className="text-white font-black text-sm tracking-wide group-hover:text-red-400 transition">
                    {ex.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">{ex.equipment}</span>
                    <span className="text-slate-800 text-xs">·</span>
                    <span className="text-slate-600 text-xs font-semibold">{ex.muscles.join(' · ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="hidden sm:block text-xs font-black text-slate-700 uppercase tracking-widest">{ex.category}</span>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-slate-800 border border-slate-700 hover:bg-red-600 hover:border-red-600 transition"
                >
                  + ADD
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton shell */}
        <div className="hidden border border-slate-700 animate-pulse mt-4">
          {[1, 2, 3, 4].map((n) => (
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

        {/* Empty state shell */}
        <div className="hidden border border-slate-700 flex flex-col items-center py-16 text-center mt-4">
          <p className="text-slate-700 font-black text-4xl mb-3">?</p>
          <p className="text-white font-black text-lg uppercase tracking-wide mb-1">NO RESULTS</p>
          <p className="text-slate-500 text-sm">Try different keywords or clear filters</p>
        </div>

      </div>
    </div>
  )
}
