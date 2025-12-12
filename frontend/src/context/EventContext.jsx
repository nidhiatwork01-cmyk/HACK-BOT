import { createContext, useContext, useState, useEffect } from 'react'
import { getEvents, createEvent, registerEvent, getStats } from '../services/api'
import { semanticSearch } from '../services/ml'

const EventContext = createContext()

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within EventProvider')
  }
  return context
}

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({ category: 'all', search: '' })

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Use semantic search if search query exists, otherwise use regular search
      if (filters.search && filters.search.trim().length > 0) {
        try {
          const searchResults = await semanticSearch(
            filters.search,
            50,
            filters.category !== 'all' ? filters.category : null,
            null
          )
          // Extract results from semantic search response
          const events = searchResults.results || searchResults || []
          setEvents(events)
        } catch (semanticError) {
          // Fallback to regular search if semantic search fails
          console.warn('Semantic search failed, using regular search:', semanticError)
          const data = await getEvents(filters)
          setEvents(data)
        }
      } else {
        const data = await getEvents(filters)
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const addEvent = async (eventData, token) => {
    try {
      const newEvent = await createEvent(eventData, token)
      await fetchEvents()
      await fetchStats()
      return newEvent
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  const handleRegister = async (eventId, eventPassword = null) => {
    try {
      await registerEvent(eventId, eventPassword)
      await fetchEvents()
      await fetchStats()
    } catch (error) {
      console.error('Error registering:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchStats()
  }, [filters])

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        stats,
        filters,
        setFilters,
        fetchEvents,
        fetchStats,
        addEvent,
        handleRegister,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

