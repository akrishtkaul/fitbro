import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { askQuestion } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function IconClose() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
function IconSend() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

const SUGGESTIONS = [
  'What should I focus on next?',
  'How is my progress looking?',
  'Recommend a recovery plan',
  'Am I overtraining?',
]

export default function TrainerPanel({ open, onClose }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(text) {
    const q = (text ?? input).trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await askQuestion(user.id, q)
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-slate-900 border-l border-slate-800 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div>
            <p className="text-white font-black text-sm uppercase tracking-widest">AI TRAINER</p>
            <p className="text-slate-600 text-xs font-semibold mt-0.5">Powered by GPT-4o mini</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 transition"
          >
            <IconClose />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="pt-4">
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-4 text-center">
                ASK ME ANYTHING ABOUT YOUR TRAINING
              </p>
              <div className="space-y-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="w-full text-left px-4 py-3 border border-slate-800 hover:border-red-600 hover:bg-red-950/20 text-slate-400 hover:text-white text-xs font-semibold transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-6 h-6 bg-red-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <span className="text-white font-black text-xs">AI</span>
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'bg-slate-800/60 border border-slate-700 text-slate-300'
              }`}>
                {msg.role === 'user' ? msg.text : (
                  <ReactMarkdown
                    components={{
                      p:      ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="text-white font-black">{children}</strong>,
                      ul:     ({ children }) => <ul className="space-y-1 mt-1">{children}</ul>,
                      ol:     ({ children }) => <ol className="space-y-1 mt-1 list-none">{children}</ol>,
                      li:     ({ children }) => <li className="flex gap-2"><span className="text-red-500 flex-shrink-0">•</span><span>{children}</span></li>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 bg-red-600 flex items-center justify-center flex-shrink-0 mr-2">
                <span className="text-white font-black text-xs">AI</span>
              </div>
              <div className="px-4 py-3 bg-slate-800/60 border border-slate-700">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-slate-800 p-4">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask your trainer..."
              className="flex-1 bg-slate-800 border border-slate-700 px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-red-600 transition resize-none"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-600 text-white transition flex items-center"
            >
              <IconSend />
            </button>
          </div>
          <p className="text-slate-700 text-xs mt-2 font-semibold">Press Enter to send</p>
        </div>
      </div>
    </>
  )
}
