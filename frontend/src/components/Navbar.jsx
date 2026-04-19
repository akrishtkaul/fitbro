const NAV_LINKS = [
  { label: 'PROFILE', href: '#profile' },
  { label: 'EXERCISES', href: '#exercises' },
  { label: 'LOG WORKOUT', href: '#log' },
  { label: 'HISTORY', href: '#history' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-0 select-none">
          <span className="text-white font-black text-xl tracking-tighter leading-none">FIT</span>
          <span className="text-red-500 font-black text-xl tracking-tighter leading-none">BRO</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-xs font-bold tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#log"
            className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase transition"
          >
            + LOG
          </a>
        </div>

        {/* Mobile hamburger */}
        <button type="button" className="md:hidden p-2 text-slate-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </nav>
  )
}
