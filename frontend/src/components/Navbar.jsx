import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import TrainerPanel from './TrainerPanel'

const NAV_LINKS = [
  { label: 'LOG',       page: 'log'       },
  { label: 'HISTORY',   page: 'history'   },
  { label: 'EXERCISES', page: 'exercises' },
  { label: 'PROFILE',   page: 'profile'   },
]

export default function Navbar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth()
  const [trainerOpen, setTrainerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <button type="button" onClick={() => onNavigate('log')} className="flex items-center gap-0 select-none">
            <span className="text-white font-black text-xl tracking-tighter leading-none">FIT</span>
            <span className="text-red-500 font-black text-xl tracking-tighter leading-none">BRO</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                type="button"
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 text-xs font-bold tracking-widest transition ${
                  currentPage === link.page
                    ? 'text-white bg-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setTrainerOpen(true)}
              className="ml-2 px-4 py-2 text-xs font-bold tracking-widest text-red-400 hover:text-white hover:bg-red-600 border border-red-900 hover:border-red-600 transition"
            >
              AI TRAINER
            </button>

            <button
              type="button"
              onClick={() => onNavigate('log')}
              className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase transition"
            >
              + LOG
            </button>
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTrainerOpen(true)}
              className="px-3 py-1.5 text-xs font-bold tracking-widest text-red-400 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
            >
              TRAINER
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 text-slate-400 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                type="button"
                onClick={() => { onNavigate(link.page); setMenuOpen(false) }}
                className={`w-full text-left px-5 py-3.5 text-xs font-bold tracking-widest border-b border-slate-800 transition ${
                  currentPage === link.page ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 py-3 flex items-center justify-between">
              {user && <span className="text-slate-600 text-xs font-bold uppercase">{user.username}</span>}
              <button type="button" onClick={logout} className="text-xs font-bold text-slate-600 hover:text-red-500 uppercase tracking-widest transition">
                SIGN OUT
              </button>
            </div>
          </div>
        )}
      </nav>

      <TrainerPanel open={trainerOpen} onClose={() => setTrainerOpen(false)} />
    </>
  )
}
