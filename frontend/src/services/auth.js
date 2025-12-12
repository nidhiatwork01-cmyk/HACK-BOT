import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const register = async (email, password, name, role = 'student', secretKey = '', societyName = '') => {
  try {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      name, 
      role,
      secret_key: secretKey,
      society_name: societyName
    })
    return response.data
  } catch (error) {
    console.error('Error registering:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Registration failed')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  } catch (error) {
    console.error('Error logging in:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Login failed')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const getCurrentUser = async (token) => {
  try {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

