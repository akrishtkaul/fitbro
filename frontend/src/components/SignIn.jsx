import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function SignIn() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const name = username.trim()
    if (!name) { setError('Enter a username to continue.'); return }
    setLoading(true)
    setError('')
    try {
      await login(name)
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Failed to sign in. Is the backend running?')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex mb-6">
            <span className="text-white font-black text-5xl tracking-tighter leading-none">FIT</span>
            <span className="text-red-500 font-black text-5xl tracking-tighter leading-none">BRO</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">YOUR AI FITNESS TRAINER</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 px-4 py-4 text-white font-semibold text-sm focus:outline-none focus:border-red-600 transition placeholder-slate-700"
              placeholder="Enter your username"
            />
          </div>

          {error && (
            <div className="bg-red-950 border-l-4 border-red-600 px-4 py-3 mb-4">
              <p className="text-red-400 text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black uppercase tracking-widest text-sm transition"
          >
            {loading ? 'LOADING...' : 'ENTER'}
          </button>
        </form>

        <p className="text-slate-700 text-xs text-center mt-6 font-semibold">
          New user? A profile will be created automatically.
        </p>
      </div>
    </div>
  )
}
