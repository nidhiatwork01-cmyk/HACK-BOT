import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Public API instance (no auth required)
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export const submitEventRequest = async (requestText) => {
  try {
    // Try with auth first, fallback to public
    const token = localStorage.getItem('token')
    const apiInstance = token ? api : publicApi
    
    const response = await apiInstance.post('/assistant/request', { request: requestText })
    return response.data
  } catch (error) {
    console.error('Error submitting request:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to submit request')
    }
    throw new Error('Network error. Is the backend running?')
  }
}

export const getEventRequests = async (status = 'all') => {
  try {
    const response = await api.get(`/assistant/requests?status=${status}`)
    return response.data
  } catch (error) {
    console.error('Error fetching requests:', error)
    throw error
  }
}

export const respondToRequest = async (requestId, response, status = 'responded') => {
  try {
    const result = await api.post(`/assistant/requests/${requestId}/respond`, {
      response,
      status
    })
    return result.data
  } catch (error) {
    console.error('Error responding to request:', error)
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to respond')
    }
    throw error
  }
}

export const getAssistantStats = async () => {
  try {
    const response = await api.get('/assistant/stats')
    return response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}

export const getRecentRequests = async () => {
  try {
    const response = await publicApi.get('/assistant/requests/recent')
    return response.data
  } catch (error) {
    console.error('Error fetching recent requests:', error)
    throw error
  }
}

