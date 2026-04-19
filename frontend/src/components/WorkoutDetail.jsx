const WORKOUT = {
  name: 'PUSH DAY A',
  date: 'FRI, APR 18, 2026',
  time: '7:30 AM',
  duration: '58:00',
  totalVolume: '4,820',
  notes: 'Feeling strong today. New bench PR — 90 kg for 8 clean reps. Shoulder tight on OHP, extra warm-up next time.',
  exercises: [
    {
      id: 1,
      name: 'BARBELL BENCH PRESS',
      muscles: ['CHEST', 'TRICEPS', 'FRONT DELTS'],
      sets: [
        { set: 1, type: 'WARM-UP', weight: '75.0', reps: 12 },
        { set: 2, type: 'WORKING', weight: '82.5', reps: 10 },
        { set: 3, type: 'WORKING', weight: '87.5', reps: 8 },
        { set: 4, type: 'PR',      weight: '90.0', reps: 8 },
      ],
    },
    {
      id: 2,
      name: 'INCLINE DUMBBELL PRESS',
      muscles: ['UPPER CHEST', 'FRONT DELTS'],
      sets: [
        { set: 1, type: 'WORKING', weight: '30.0', reps: 12 },
        { set: 2, type: 'WORKING', weight: '32.0', reps: 10 },
        { set: 3, type: 'WORKING', weight: '34.0', reps: 9 },
      ],
    },
    {
      id: 3,
      name: 'OVERHEAD PRESS',
      muscles: ['SHOULDERS', 'TRICEPS', 'CORE'],
      sets: [
        { set: 1, type: 'WARM-UP', weight: '40.0', reps: 10 },
        { set: 2, type: 'WORKING', weight: '55.0', reps: 8 },
        { set: 3, type: 'WORKING', weight: '55.0', reps: 7 },
      ],
    },
  ],
}

function IconArrowLeft() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

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

function ExerciseCard({ exercise }) {
  const maxWeight = Math.max(...exercise.sets.map((s) => parseFloat(s.weight)))
  const totalVolume = exercise.sets.reduce((a, s) => a + parseFloat(s.weight) * s.reps, 0)

  return (
    <div className="border border-slate-700 bg-slate-900">

      {/* Exercise header — red left border accent */}
      <div className="border-l-4 border-red-600">
        <div className="flex items-start justify-between px-4 py-4 border-b border-slate-700">
          <div>
            <h3 className="text-white font-black text-sm tracking-wide mb-1">{exercise.name}</h3>
            <p className="text-slate-500 text-xs font-semibold tracking-widest">
              {exercise.muscles.join(' · ')}
            </p>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition"
            >
              <IconEdit />
              EDIT
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider text-red-500 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
            >
              <IconTrash />
              REMOVE
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 border-b border-slate-700 bg-slate-800/40">
          {[
            { label: 'SETS', value: exercise.sets.length },
            { label: 'MAX WEIGHT', value: `${maxWeight} KG` },
            { label: 'VOLUME', value: `${totalVolume.toLocaleString()} KG` },
          ].map((s, i) => (
            <div key={s.label} className={`px-4 py-3 ${i < 2 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-white font-black text-base num leading-none">{s.value}</p>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Set table header */}
      <div className="grid grid-cols-12 px-4 py-2 bg-slate-800/60 border-b border-slate-700">
        <div className="col-span-1 text-xs font-black text-slate-600 uppercase tracking-widest">SET</div>
        <div className="col-span-3 text-xs font-black text-slate-600 uppercase tracking-widest">TYPE</div>
        <div className="col-span-4 text-xs font-black text-slate-600 uppercase tracking-widest text-right">WEIGHT</div>
        <div className="col-span-4 text-xs font-black text-slate-600 uppercase tracking-widest text-right">REPS</div>
      </div>

      {/* Set rows */}
      {exercise.sets.map((s, idx) => {
        const isPR = s.type === 'PR'
        const isLast = idx === exercise.sets.length - 1
        return (
          <div
            key={s.set}
            className={`grid grid-cols-12 items-center px-4 py-3 ${!isLast ? 'border-b border-slate-800' : ''} ${isPR ? 'bg-red-950/50' : 'hover:bg-slate-800/30'} transition`}
          >
            <div className="col-span-1">
              <span className="text-slate-600 text-sm font-bold num">{s.set}</span>
            </div>
            <div className="col-span-3">
              {isPR ? (
                <span className="inline-block bg-red-600 text-white text-xs font-black px-2 py-0.5 tracking-wider">
                  PR
                </span>
              ) : (
                <span className="text-slate-600 text-xs font-semibold uppercase tracking-wide">{s.type}</span>
              )}
            </div>
            <div className="col-span-4 text-right">
              <span className={`text-xl font-black num leading-none ${isPR ? 'text-red-400' : 'text-white'}`}>
                {s.weight}
              </span>
              <span className="text-slate-600 text-xs font-semibold ml-1">KG</span>
            </div>
            <div className="col-span-4 text-right">
              <span className={`text-xl font-black num leading-none ${isPR ? 'text-red-400' : 'text-white'}`}>
                {s.reps}
              </span>
              <span className="text-slate-600 text-xs font-semibold ml-1">REPS</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function WorkoutDetail() {
  const totalSets = WORKOUT.exercises.reduce((a, e) => a + e.sets.length, 0)
  const totalReps = WORKOUT.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + s.reps, 0), 0)

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-8">
          <button type="button" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-black tracking-widest uppercase transition">
            <IconArrowLeft />
            HISTORY
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs font-black tracking-wider text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition"
            >
              <IconEdit />
              EDIT WORKOUT
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs font-black tracking-wider text-white bg-red-600 hover:bg-red-700 transition"
            >
              <IconTrash />
              DELETE
            </button>
          </div>
        </div>

        {/* Workout title */}
        <div className="mb-6">
          <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-3">
            {WORKOUT.name}
          </h1>
          <p className="text-slate-500 text-sm font-semibold tracking-wider">
            {WORKOUT.date}&nbsp;&nbsp;·&nbsp;&nbsp;{WORKOUT.time}&nbsp;&nbsp;·&nbsp;&nbsp;{WORKOUT.duration}
          </p>
        </div>

        {/* Stats bar — no rounded corners, strong borders */}
        <div className="grid grid-cols-4 border border-slate-700 mb-6">
          {[
            { value: WORKOUT.exercises.length.toString(), label: 'EXERCISES' },
            { value: totalSets.toString(), label: 'SETS' },
            { value: totalReps.toString(), label: 'TOTAL REPS' },
            { value: WORKOUT.totalVolume, label: 'VOLUME (KG)' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-4 px-3 text-center ${i < 3 ? 'border-r border-slate-700' : ''}`}
            >
              <p className="text-3xl font-black text-white num leading-none mb-2">{stat.value}</p>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Error state shell */}
        <div className="hidden items-center gap-3 bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
          <p className="text-red-400 text-sm font-semibold">Failed to load workout. Please try again.</p>
        </div>

        {/* Notes */}
        {WORKOUT.notes && (
          <div className="border-l-2 border-red-700 pl-4 mb-8">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">NOTES</p>
            <p className="text-slate-400 text-sm leading-relaxed">{WORKOUT.notes}</p>
          </div>
        )}

        {/* Exercise list */}
        <div className="space-y-4 mb-6">
          {WORKOUT.exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>

        {/* Skeleton shell */}
        <div className="hidden space-y-4 mb-6">
          {[1, 2].map((n) => (
            <div key={n} className="border border-slate-800 bg-slate-900 animate-pulse">
              <div className="border-l-4 border-slate-700 px-4 py-4 border-b border-slate-800">
                <div className="h-4 bg-slate-800 rounded w-48 mb-2" />
                <div className="h-3 bg-slate-800 rounded w-32" />
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((r) => <div key={r} className="h-10 bg-slate-800 rounded" />)}
              </div>
            </div>
          ))}
        </div>

        {/* Repeat button */}
        <button
          type="button"
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm transition"
        >
          REPEAT THIS WORKOUT
        </button>

      </div>
    </div>
  )
}
