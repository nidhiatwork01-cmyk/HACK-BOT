import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'all') {
    params.append('category', filters.category)
  }
  if (filters.search) {
    params.append('search', filters.search)
  }
  const response = await api.get(`/events?${params.toString()}`)
  return response.data
}

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`)
  return response.data
}

export const registerForEvent = async (eventId, password = null) => {
  try {
    const response = await api.post(`/events/${eventId}/register`, {
      event_password: password
    })
    return response.data
  } catch (error) {
    console.error('Error registering for event:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to register')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const createEvent = async (eventData, token) => {
  try {
    const response = await api.post('/events', eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating event:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to create event')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const registerEvent = async (eventId, eventPassword = null, email = null) => {
  try {
    const response = await api.post(`/events/${eventId}/register`, { 
      event_password: eventPassword,
      email: email
    })
    return response.data
  } catch (error) {
    console.error('Error registering:', error)
    if (error.response) {
      if (error.response.data.requires_password) {
        throw { requiresPassword: true, message: error.response.data.error }
      }
      throw new Error(error.response.data.error || 'Failed to register')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const markAsRegistered = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/mark-registered`)
    return response.data
  } catch (error) {
    console.error('Error marking as registered:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to mark as registered')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const verifyEventPassword = async (eventId, password) => {
  try {
    const response = await api.post(`/events/${eventId}/verify-password`, { password })
    return response.data
  } catch (error) {
    if (error.response) {
      return { valid: false, error: error.response.data.error }
    }
    throw error
  }
}

export const getRegistrations = async (eventId) => {
  const response = await api.get(`/events/${eventId}/registrations`)
  return response.data
}

export const getStats = async () => {
  const response = await api.get('/stats')
  return response.data
}

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/profile`)
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch profile')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const getUserEvents = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/events`)
    return response.data
  } catch (error) {
    console.error('Error fetching user events:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch events')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

