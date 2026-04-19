import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('fitbro_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('fitbro_user') }
    }
    setLoading(false)
  }, [])

  async function login(username) {
    const res = await loginUser(username)
    const userData = res.data
    setUser(userData)
    localStorage.setItem('fitbro_user', JSON.stringify(userData))
    return userData
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('fitbro_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
