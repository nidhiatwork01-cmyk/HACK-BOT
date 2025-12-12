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

// Public API instance
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getRecommendations = async () => {
  try {
    const response = await api.get('/ml/recommendations')
    return response.data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    throw error
  }
}

export const predictEventPopularity = async (eventData) => {
  try {
    const response = await api.post('/ml/predict-popularity', eventData)
    return response.data
  } catch (error) {
    console.error('Error predicting popularity:', error)
    throw error
  }
}

export const getTrendingCategories = async (days = 30) => {
  try {
    const response = await publicApi.get(`/ml/trending?days=${days}`)
    return response.data
  } catch (error) {
    console.error('Error fetching trending categories:', error)
    throw error
  }
}

export const semanticSearch = async (query, limit = 10, category = null, date = null) => {
  try {
    const params = new URLSearchParams({ q: query, limit: limit.toString() })
    if (category) params.append('category', category)
    if (date) params.append('date', date)
    
    const response = await publicApi.get(`/ml/search?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error('Error in semantic search:', error)
    throw error
  }
}

export const enhanceDescription = async (description, title, category, date, venue) => {
  try {
    const response = await api.post('/ml/enhance-description', {
      description,
      title,
      category,
      date,
      venue
    })
    return response.data
  } catch (error) {
    console.error('Error enhancing description:', error)
    throw error
  }
}

export const predictEventSuccess = async (eventData) => {
  try {
    const response = await api.post('/ml/predict-success', eventData)
    return response.data
  } catch (error) {
    console.error('Error predicting success:', error)
    throw error
  }
}
