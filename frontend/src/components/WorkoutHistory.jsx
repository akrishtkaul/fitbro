const WORKOUTS = [
  { id: 1, date: 'APR 18', day: 'FRI', name: 'PUSH DAY A',   exercises: 5, sets: 18, volume: '4,820', duration: '58 MIN', notes: 'New bench PR — 90 kg. Felt incredible.' },
  { id: 2, date: 'APR 17', day: 'THU', name: 'PULL DAY B',   exercises: 6, sets: 22, volume: '5,140', duration: '64 MIN', notes: 'Deadlift form locked in. Good session.' },
  { id: 3, date: 'APR 16', day: 'WED', name: 'LEG DAY',      exercises: 7, sets: 24, volume: '8,200', duration: '72 MIN', notes: 'Squats heavy. Sleep was garbage.' },
  { id: 4, date: 'APR 14', day: 'MON', name: 'UPPER BODY',   exercises: 4, sets: 14, volume: '2,980', duration: '50 MIN', notes: '' },
  { id: 5, date: 'APR 12', day: 'SAT', name: 'PUSH DAY A',   exercises: 5, sets: 17, volume: '4,620', duration: '55 MIN', notes: '' },
  { id: 6, date: 'APR 10', day: 'THU', name: 'PULL DAY B',   exercises: 6, sets: 20, volume: '4,900', duration: '60 MIN', notes: 'Light week, deload.' },
]

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

function WorkoutRow({ workout }) {
  return (
    <div className="group flex items-center border-b border-slate-800 hover:bg-slate-800/40 hover:border-l-2 hover:border-l-red-600 transition-all px-4 py-4 cursor-pointer">

      {/* Date */}
      <div className="w-16 flex-shrink-0 mr-4">
        <p className="text-white font-black text-sm num leading-none">{workout.date}</p>
        <p className="text-slate-600 text-xs font-bold mt-0.5">{workout.day}</p>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-white font-black text-sm tracking-wide group-hover:text-red-400 transition truncate">
          {workout.name}
        </p>
        {workout.notes && (
          <p className="text-slate-600 text-xs mt-0.5 truncate">{workout.notes}</p>
        )}
      </div>

      {/* Stats - hidden on mobile */}
      <div className="hidden sm:flex items-center gap-6 mr-4 flex-shrink-0">
        <div className="text-right">
          <p className="text-white font-black text-sm num">{workout.exercises}</p>
          <p className="text-slate-600 text-xs uppercase tracking-wider">EX</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-sm num">{workout.sets}</p>
          <p className="text-slate-600 text-xs uppercase tracking-wider">SETS</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-sm num">{workout.volume}</p>
          <p className="text-slate-600 text-xs uppercase tracking-wider">KG</p>
        </div>
        <div className="text-right">
          <p className="text-white font-black text-sm num">{workout.duration}</p>
          <p className="text-slate-600 text-xs uppercase tracking-wider">TIME</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          className="p-2 text-slate-600 hover:text-white hover:bg-slate-700 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <IconEdit />
        </button>
        <button
          type="button"
          className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-950 transition"
          onClick={(e) => e.stopPropagation()}
        >
          <IconTrash />
        </button>
        <span className="text-slate-700 group-hover:text-slate-500 transition ml-1">
          <IconChevronRight />
        </span>
      </div>

    </div>
  )
}

export default function WorkoutHistory() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">HISTORY</h1>
            <p className="text-slate-500 text-sm font-semibold">142 WORKOUTS LOGGED</p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase transition"
          >
            + NEW WORKOUT
          </button>
        </div>

        {/* Monthly summary — big numbers */}
        <div className="grid grid-cols-4 border border-slate-700 mb-6">
          {[
            { value: '18',     label: 'THIS MONTH' },
            { value: '68,420', label: 'TOTAL KG' },
            { value: '59',     label: 'AVG MIN' },
            { value: '7',      label: 'DAY STREAK' },
          ].map((s, i) => (
            <div key={s.label} className={`py-4 px-4 ${i < 3 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-2xl font-black text-white num leading-none mb-1">{s.value}</p>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 pl-9 pr-4 py-2.5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-slate-500 transition"
              placeholder="SEARCH WORKOUTS..."
            />
          </div>
          <select className="bg-slate-900 border border-slate-700 text-slate-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-slate-500 cursor-pointer">
            <option>ALL TIME</option>
            <option>THIS WEEK</option>
            <option>THIS MONTH</option>
            <option>LAST 3 MONTHS</option>
          </select>
          <select className="bg-slate-900 border border-slate-700 text-slate-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-slate-500 cursor-pointer">
            <option>NEWEST FIRST</option>
            <option>OLDEST FIRST</option>
            <option>MOST VOLUME</option>
          </select>
        </div>

        {/* Table header */}
        <div className="flex items-center border-b border-slate-700 bg-slate-900/50 px-4 py-2">
          <div className="w-16 mr-4 text-xs font-black text-slate-600 uppercase tracking-widest">DATE</div>
          <div className="flex-1 text-xs font-black text-slate-600 uppercase tracking-widest">WORKOUT</div>
          <div className="hidden sm:flex items-center gap-6 mr-4">
            {['EX', 'SETS', 'KG', 'TIME'].map((h) => (
              <div key={h} className="w-10 text-right text-xs font-black text-slate-600 uppercase tracking-widest">{h}</div>
            ))}
          </div>
          <div className="w-24" />
        </div>

        {/* Workout rows */}
        <div className="border-x border-slate-800">
          {WORKOUTS.map((w) => (
            <WorkoutRow key={w.id} workout={w} />
          ))}
        </div>

        {/* Skeleton shell */}
        <div className="hidden border-x border-slate-800 animate-pulse">
          {[1, 2, 3].map((n) => (
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
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-6 bg-slate-800 rounded w-10" />)}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state shell */}
        <div className="hidden border border-slate-800 flex flex-col items-center py-20 text-center mt-4">
          <p className="text-slate-700 font-black text-5xl mb-4">0</p>
          <p className="text-white font-black text-xl uppercase tracking-wide mb-2">NO WORKOUTS YET</p>
          <p className="text-slate-500 text-sm mb-6">Log your first session to start tracking</p>
          <button type="button" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition">
            LOG FIRST WORKOUT
          </button>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-1 mt-6">
          <button type="button" className="px-3 py-2 text-xs font-bold text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-white transition">
            ← PREV
          </button>
          {[1, 2, 3].map((p) => (
            <button key={p} type="button" className={`px-3 py-2 text-xs font-bold transition border ${p === 1 ? 'bg-red-600 text-white border-red-600' : 'text-slate-500 border-slate-800 hover:border-slate-600 hover:text-white'}`}>
              {p}
            </button>
          ))}
          <span className="px-2 text-slate-700 text-xs font-bold">...</span>
          <button type="button" className="px-3 py-2 text-xs font-bold text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-white transition">8</button>
          <button type="button" className="px-3 py-2 text-xs font-bold text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-white transition">
            NEXT →
          </button>
        </div>

      </div>
    </div>
  )
}
