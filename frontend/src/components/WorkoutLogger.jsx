const ADDED_EXERCISES = [
  {
    id: 1,
    name: 'BARBELL BENCH PRESS',
    muscles: ['CHEST', 'TRICEPS'],
    sets: [
      { set: 1, weight: '80', reps: '10' },
      { set: 2, weight: '85', reps: '8' },
      { set: 3, weight: '85', reps: '7' },
    ],
  },
  {
    id: 2,
    name: 'INCLINE DUMBBELL PRESS',
    muscles: ['UPPER CHEST', 'FRONT DELTS'],
    sets: [
      { set: 1, weight: '32', reps: '12' },
      { set: 2, weight: '34', reps: '10' },
    ],
  },
]

function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function ExerciseBlock({ exercise }) {
  return (
    <div className="border border-slate-700 bg-slate-900 mb-4">

      {/* Exercise header */}
      <div className="border-l-4 border-red-600 flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div>
          <p className="text-white font-black text-sm tracking-wide">{exercise.name}</p>
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mt-0.5">
            {exercise.muscles.join(' · ')}
          </p>
        </div>
        <button type="button" className="flex items-center gap-1.5 text-red-500 hover:text-white hover:bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider border border-red-900 hover:border-red-600 transition">
          <IconTrash />
          REMOVE
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <div className="col-span-1 text-xs font-black text-slate-600 uppercase tracking-widest">SET</div>
        <div className="col-span-5 text-xs font-black text-slate-600 uppercase tracking-widest">WEIGHT (KG)</div>
        <div className="col-span-4 text-xs font-black text-slate-600 uppercase tracking-widest">REPS</div>
        <div className="col-span-2" />
      </div>

      {/* Set rows */}
      {exercise.sets.map((s, idx) => (
        <div key={s.set} className={`grid grid-cols-12 items-center px-4 py-2.5 gap-2 ${idx < exercise.sets.length - 1 ? 'border-b border-slate-800' : ''}`}>
          <div className="col-span-1">
            <span className="text-slate-600 text-sm font-black num">{s.set}</span>
          </div>
          <div className="col-span-5">
            <input
              type="number"
              defaultValue={s.weight}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 text-white font-black text-sm num text-center focus:outline-none focus:border-red-600 transition"
              placeholder="0"
            />
          </div>
          <div className="col-span-4">
            <input
              type="number"
              defaultValue={s.reps}
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 text-white font-black text-sm num text-center focus:outline-none focus:border-red-600 transition"
              placeholder="0"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button type="button" className="p-2 text-slate-700 hover:text-red-500 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Add set */}
      <div className="border-t border-slate-800 px-4 py-2.5">
        <button type="button" className="text-slate-500 hover:text-red-400 text-xs font-black uppercase tracking-widest transition">
          + ADD SET
        </button>
      </div>
    </div>
  )
}

export default function WorkoutLogger() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">LOG WORKOUT</h1>
            <p className="text-slate-500 text-sm font-semibold">FRI, APR 18, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-red-500 font-black text-3xl num leading-none">0:42</p>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">ELAPSED</p>
          </div>
        </div>

        {/* Error shell */}
        <div className="hidden items-center gap-3 bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
          <p className="text-red-400 text-sm font-semibold">Failed to save workout. Check your connection.</p>
        </div>

        {/* Workout name */}
        <div className="mb-4">
          <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">WORKOUT NAME</label>
          <input
            type="text"
            defaultValue="PUSH DAY A"
            className="w-full bg-slate-900 border border-slate-700 px-4 py-3 text-white font-black text-lg tracking-wide focus:outline-none focus:border-red-600 transition"
            placeholder="WORKOUT NAME"
          />
        </div>

        {/* Exercise search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-700 pl-11 pr-4 py-3 text-white placeholder-slate-600 text-sm font-semibold focus:outline-none focus:border-red-600 transition"
            placeholder="SEARCH AND ADD EXERCISES..."
          />
        </div>

        {/* Search dropdown shell (shown state) */}
        <div className="hidden border border-slate-700 bg-slate-900 mb-6">
          {['BARBELL SQUAT', 'FRONT SQUAT', 'GOBLET SQUAT'].map((name) => (
            <button
              key={name}
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800 text-left transition"
            >
              <div>
                <p className="text-white font-bold text-sm tracking-wide">{name}</p>
                <p className="text-slate-600 text-xs uppercase tracking-wider mt-0.5">BARBELL · QUADS · GLUTES</p>
              </div>
              <span className="text-red-500 font-black text-lg">+</span>
            </button>
          ))}
        </div>

        {/* Added exercises */}
        {ADDED_EXERCISES.map((ex) => (
          <ExerciseBlock key={ex.id} exercise={ex} />
        ))}

        {/* Empty exercise state shell */}
        <div className="hidden border border-dashed border-slate-700 flex flex-col items-center py-12 text-center mb-6">
          <p className="text-slate-700 font-black text-4xl mb-3">0</p>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-1">NO EXERCISES ADDED</p>
          <p className="text-slate-600 text-xs">Search above to add your first exercise</p>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">NOTES</label>
          <textarea
            rows={3}
            defaultValue="Feeling strong today. Increased bench by 5 kg."
            className="w-full bg-slate-900 border border-slate-700 px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-red-600 transition resize-none"
            placeholder="How did it go? Any notes?"
          />
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 border border-slate-700 mb-6">
          {[
            { label: 'EXERCISES', value: '2' },
            { label: 'TOTAL SETS', value: '5' },
            { label: 'VOLUME',     value: '2,340 KG' },
          ].map((s, i) => (
            <div key={s.label} className={`py-3 px-4 ${i < 2 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-white font-black text-xl num leading-none">{s.value}</p>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <button type="button" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm transition mb-3">
          FINISH WORKOUT
        </button>
        <button type="button" className="w-full py-2 text-slate-600 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition text-center">
          DISCARD WORKOUT
        </button>

      </div>
    </div>
  )
}
