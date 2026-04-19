import { useState, useEffect } from 'react'
import { getUser, updateUser } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function UserProfile() {
  const { user: authUser, logout } = useAuth()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ username: '', height: '', weight: '', age: '' })

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUser(authUser.id)
        setUser(res.data)
        setForm({
          username: res.data.username ?? '',
          height:   res.data.height   ?? '',
          weight:   res.data.weight   ?? '',
          age:      res.data.age      ?? '',
        })
      } catch {
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.username.trim()) { setError('Username is required.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await updateUser(authUser.id, {
        username: form.username,
        height:   form.height ? parseFloat(form.height) : undefined,
        weight:   form.weight ? parseFloat(form.weight) : undefined,
        age:      form.age    ? parseInt(form.age)      : undefined,
      })
      setUser(res.data)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setEditing(false)
    setError('')
    setForm({
      username: user?.username ?? '',
      height:   user?.height   ?? '',
      weight:   user?.weight   ?? '',
      age:      user?.age      ?? '',
    })
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-slate-800" />
            <div className="space-y-2">
              <div className="h-5 bg-slate-800 rounded w-40" />
              <div className="h-3 bg-slate-800 rounded w-24" />
            </div>
          </div>
          <div className="h-24 bg-slate-900 border border-slate-800" />
          <div className="h-64 bg-slate-900 border border-slate-800" />
        </div>
      </div>
    )
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'FB'

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 bg-red-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xl tracking-tight">{initials}</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
              {user?.username?.toUpperCase() ?? 'UNKNOWN'}
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              {user?.created_at ? `MEMBER SINCE ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}` : 'FITBRO MEMBER'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border border-slate-700 mb-8">
          {[
            { value: user?.height ? `${user.height}` : '—', label: 'HEIGHT (IN)' },
            { value: user?.weight ? `${user.weight}` : '—', label: 'WEIGHT (LBS)' },
            { value: user?.age    ? `${user.age}`    : '—', label: 'AGE' },
          ].map((s, i) => (
            <div key={s.label} className={`py-4 px-4 text-center ${i < 2 ? 'border-r border-slate-700' : ''}`}>
              <p className="text-3xl font-black text-white num leading-none mb-1">{s.value}</p>
              <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-6">
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 bg-slate-800 border-l-4 border-green-500 px-4 py-3 mb-6">
            <p className="text-green-400 text-sm font-semibold">PROFILE UPDATED SUCCESSFULLY.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="border border-slate-700 bg-slate-900 mb-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
              <h2 className="text-sm font-black text-white uppercase tracking-widest">EDIT PROFILE</h2>
              {editing && <span className="text-xs font-black text-red-500 uppercase tracking-widest">EDITING</span>}
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">USERNAME</label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  onFocus={() => setEditing(true)}
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-semibold text-sm focus:outline-none focus:border-red-600 transition"
                  placeholder="Username"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'height', label: 'HEIGHT', unit: 'IN' },
                  { name: 'weight', label: 'WEIGHT', unit: 'LBS' },
                  { name: 'age',    label: 'AGE',    unit: 'YR' },
                ].map(({ name, label, unit }) => (
                  <div key={name}>
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">{label}</label>
                    <div className="relative">
                      <input
                        name={name}
                        type="number"
                        value={form[name]}
                        onChange={handleChange}
                        onFocus={() => setEditing(true)}
                        className="w-full bg-slate-800 border border-slate-700 px-4 py-3 text-white font-black text-sm num focus:outline-none focus:border-red-600 transition pr-10"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 px-5 pb-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest border border-slate-700 transition"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:text-red-700 text-white font-black text-xs uppercase tracking-widest transition"
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Danger zone */}
        <div className="border border-red-900/50 bg-slate-900 p-5">
          <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">DANGER ZONE</h3>
          <p className="text-slate-500 text-sm mb-4">Sign out of your account.</p>
          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-red-500 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
          >
            SIGN OUT
          </button>
        </div>

      </div>
    </div>
  )
}
