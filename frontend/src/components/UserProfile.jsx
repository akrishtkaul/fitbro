export default function UserProfile() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 bg-red-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xl tracking-tight">JD</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">JOHN DOE</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">MEMBER SINCE JAN 2024</p>
          </div>
        </div>

        {/* Stats — big numbers */}
        <div className="grid grid-cols-3 border border-slate-700 mb-8">
          {[
            { value: '142', label: 'WORKOUTS' },
            { value: '18',  label: 'THIS MONTH' },
            { value: '7',   label: 'DAY STREAK' },
          ].map((s, i) => (
            <div key={s.label} className={`py-4 px-4 text-center ${i < 2 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-3xl font-black text-white num leading-none mb-1">{s.value}</p>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Error shell */}
        <div className="hidden items-center gap-3 bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
          <p className="text-red-400 text-sm font-semibold">Failed to update profile. Please try again.</p>
        </div>

        {/* Success shell */}
        <div className="hidden items-center gap-3 bg-slate-800 border-l-4 border-green-500 px-4 py-3 mb-6">
          <p className="text-green-400 text-sm font-semibold">Profile updated successfully.</p>
        </div>

        {/* Form */}
        <div className="border border-slate-700 bg-slate-900 mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">EDIT PROFILE</h2>
            <span className="text-xs font-black text-red-500 uppercase tracking-widest">EDITING</span>
          </div>

          <div className="p-5 space-y-5">

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">USERNAME</label>
              <input
                type="text"
                defaultValue="johndoe"
                className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-semibold text-sm focus:outline-none focus:border-red-600 transition"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">EMAIL</label>
              <input
                type="email"
                defaultValue="john@fitbro.app"
                className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-semibold text-sm focus:outline-none focus:border-red-600 transition"
                placeholder="Email"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">HEIGHT</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="182"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-black text-sm num focus:outline-none focus:border-red-600 transition pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">CM</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">WEIGHT</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="82"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-black text-sm num focus:outline-none focus:border-red-600 transition pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">KG</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">AGE</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="28"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-black text-sm num focus:outline-none focus:border-red-600 transition pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">YR</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">FITNESS GOAL</label>
              <select className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-semibold text-sm focus:outline-none focus:border-red-600 transition cursor-pointer">
                <option>BUILD MUSCLE</option>
                <option>LOSE WEIGHT</option>
                <option>IMPROVE STRENGTH</option>
                <option>ENDURANCE</option>
              </select>
            </div>

          </div>

          <div className="flex gap-3 px-5 pb-5">
            <button type="button" className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest border border-slate-700 hover:border-slate-500 transition">
              CANCEL
            </button>
            <button type="button" className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition">
              SAVE CHANGES
            </button>
          </div>
        </div>

        {/* Personal records */}
        <div className="border border-slate-700 bg-slate-900 mb-6">
          <div className="px-5 py-4 border-b border-slate-700">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">PERSONAL RECORDS</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {[
              { lift: 'BENCH PRESS',      weight: '90 KG', date: 'APR 18' },
              { lift: 'SQUAT',            weight: '140 KG', date: 'APR 10' },
              { lift: 'DEADLIFT',         weight: '180 KG', date: 'MAR 22' },
              { lift: 'OVERHEAD PRESS',   weight: '70 KG',  date: 'APR 5' },
            ].map((pr) => (
              <div key={pr.lift} className="flex items-center justify-between px-5 py-3">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wide">{pr.lift}</p>
                <div className="text-right">
                  <span className="text-white font-black text-base num">{pr.weight}</span>
                  <span className="text-slate-600 text-xs font-semibold ml-3">{pr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="border border-red-900/50 bg-slate-900 p-5">
          <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">DANGER ZONE</h3>
          <p className="text-slate-500 text-sm mb-4">Permanently delete your account and all workout data.</p>
          <button type="button" className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-red-500 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-600 transition">
            DELETE ACCOUNT
          </button>
        </div>

      </div>
    </div>
  )
}
