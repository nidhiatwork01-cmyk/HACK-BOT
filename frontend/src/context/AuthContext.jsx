import { createContext, useContext, useState, useEffect } from 'react'
import { register, login, getCurrentUser } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser(token)
      setUser(userData)
    } catch (error) {
      console.error('Error loading user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (email, password, name, role = 'student', secretKey = '', societyName = '') => {
    try {
      const response = await register(email, password, name, role, secretKey, societyName)
      setToken(response.token)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password)
      setToken(response.token)
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register: handleRegister,
        login: handleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

