import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2, Mail, Trash2, Navigation } from 'lucide-react'
import { format } from 'date-fns'
import { getEvent, registerEvent, getRegistrations, markAsRegistered, deleteEvent } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'
import { openDirections, openMapSearch } from '../utils/maps'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState(0)
  const [registered, setRegistered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEvent(id)
        setEvent(eventData)
        const regData = await getRegistrations(id)
        setRegistrations(regData.count)
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleRegister = async (e) => {
    e.preventDefault()
    if (registered) return

    // Show email input if not shown yet
    if (!showEmailInput) {
      setShowEmailInput(true)
      return
    }

    // Validate email
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setSubmitting(true)

    try {
      await registerEvent(id, null, email)
      setRegistered(true)
      setRegistrations(prev => prev + 1)
      setShowEmailInput(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      alert(error.message || 'Registration failed. You may already be registered.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAlreadyRegistered = async () => {
    setSubmitting(true)
    try {
      await markAsRegistered(id)
      setRegistrations(prev => prev + 1)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      alert(error.message || 'Failed to mark as registered')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    setSubmitting(true)
    try {
      console.log('Attempting to delete event:', id)
      console.log('User:', user)
      console.log('Event:', event)
      console.log('Token exists:', !!localStorage.getItem('token'))
      
      await deleteEvent(id)
      alert('Event deleted successfully!')
      navigate('/events')
    } catch (error) {
      console.error('Delete error details:', error)
      console.error('Error response:', error.response)
      console.error('Error message:', error.message)
      
      let errorMessage = 'Failed to delete event'
      
      if (error.response) {
        const errorData = error.response.data
        errorMessage = errorData.error || errorMessage
        if (errorData.details) {
          errorMessage += `\n\nDetails: ${errorData.details}`
        }
        if (error.response.status === 401) {
          errorMessage = 'You are not logged in. Please log in and try again.'
        } else if (error.response.status === 403) {
          errorMessage = errorData.error || 'You do not have permission to delete this event.'
        } else if (error.response.status === 404) {
          errorMessage = 'Event not found. It may have already been deleted.'
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(`Error: ${errorMessage}\n\nPlease check:\n- You are logged in\n- You are the event creator or an admin\n- Backend server is running on port 5000`)
    } finally {
      setSubmitting(false)
    }
  }

  // Check if current user is the event creator
  // Also allow deletion if event is orphaned (created_by is null/undefined) - any logged-in user can delete orphaned events
  const isEventCreator = user && event && (
    user.id === event.created_by || 
    event.created_by === null || 
    event.created_by === undefined
  )
  
  // Show delete button if user is creator, admin, or event is orphaned
  const canDelete = isEventCreator || (user && ['admin', 'faculty', 'ksac_member'].includes(user.role))


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Event not found</p>
            <Button onClick={() => navigate('/events')} className="mt-4">
              Back to Events
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const eventDate = new Date(`${event.date}T${event.time}`)
  const categoryColors = {
    technical: 'bg-blue-100 text-blue-700',
    cultural: 'bg-purple-100 text-purple-700',
    sports: 'bg-green-100 text-green-700',
    academic: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {event.poster_url && (
              <Card className="p-0 overflow-hidden">
                <img
                  src={event.poster_url}
                  alt={event.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </Card>
            )}

            <Card>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                    {event.category}
                  </span>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      onClick={handleDeleteEvent}
                      disabled={submitting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete this event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{format(eventDate, 'EEEE, MMMM dd, yyyy')} at {format(eventDate, 'h:mm a')}</span>
                </div>

                <div className="flex items-center justify-between gap-3 text-gray-700">
                  <div className="flex items-center gap-3 flex-1">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">{event.venue}</span>
                      {event.location_address && event.location_address !== event.venue && (
                        <p className="text-sm text-gray-500 mt-0.5">{event.location_address}</p>
                      )}
                      {event.location_lat && event.location_lng && (
                        <p className="text-xs text-blue-600 mt-1">
                          📍 Precise location available - Click Directions for exact navigation
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Use precise location if available
                        const location = event.location_lat && event.location_lng
                          ? { coordinates: { lat: event.location_lat, lng: event.location_lng }, address: event.location_address || event.venue }
                          : event.location_address || event.venue
                        openMapSearch(location)
                      }}
                      title="View on Google Maps"
                    >
                      <MapPin className="w-3 h-3" />
                      View Map
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Use precise coordinates if available for accurate navigation
                        const destination = event.location_lat && event.location_lng
                          ? { location_lat: event.location_lat, location_lng: event.location_lng, venue: event.venue, location_address: event.location_address }
                          : event.location_address || event.venue
                        openDirections(destination)
                      }}
                      className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                      title={event.location_lat ? "Get precise directions using coordinates" : "Get directions to this venue"}
                    >
                      <Navigation className="w-3 h-3" />
                      {event.location_lat ? "Precise Directions" : "Directions"}
                    </Button>
                  </div>
                </div>

                {event.society && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">Organized by {event.society}</span>
                  </div>
                )}
              </div>

              {/* Map Preview Section */}
              {event.venue && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      Location
                      {event.location_lat && event.location_lng && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          Precise Location
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const location = event.location_lat && event.location_lng
                            ? { coordinates: { lat: event.location_lat, lng: event.location_lng }, address: event.location_address || event.venue }
                            : event.location_address || event.venue
                          openMapSearch(location)
                        }}
                        title="View on Google Maps"
                      >
                        <MapPin className="w-4 h-4" />
                        View Map
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const destination = event.location_lat && event.location_lng
                            ? { location_lat: event.location_lat, location_lng: event.location_lng, venue: event.venue, location_address: event.location_address }
                            : event.location_address || event.venue
                          openDirections(destination)
                        }}
                        className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                        title={event.location_lat ? "Get precise directions using coordinates" : "Get directions to this venue"}
                      >
                        <Navigation className="w-4 h-4" />
                        {event.location_lat ? "Precise Directions" : "Get Directions"}
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                    <a
                      href={event.location_lat && event.location_lng
                        ? `https://www.google.com/maps?q=${event.location_lat},${event.location_lng}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_address || event.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all group cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        const location = event.location_lat && event.location_lng
                          ? { coordinates: { lat: event.location_lat, lng: event.location_lng }, address: event.location_address || event.venue }
                          : event.location_address || event.venue
                        openMapSearch(location)
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800 text-center mb-2">{event.venue}</p>
                        {event.location_address && event.location_address !== event.venue && (
                          <p className="text-sm text-gray-600 text-center mb-1">{event.location_address}</p>
                        )}
                        {event.location_lat && event.location_lng && (
                          <p className="text-xs text-green-600 font-semibold mb-2">📍 Precise coordinates available</p>
                        )}
                        <p className="text-sm text-gray-600 text-center">Click to view on Google Maps</p>
                        <div className="mt-4 flex items-center gap-2 text-blue-600 group-hover:text-blue-700">
                          <Navigation className="w-4 h-4" />
                          <span className="text-sm font-medium">Get Directions</span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {event.location_lat 
                      ? "Precise location coordinates available - Click for exact navigation to KIIT University"
                      : "Click the map or use the buttons above to get directions to this venue"}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description || 'No description provided.'}
                </p>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{registrations}</p>
                <p className="text-gray-600">Registered</p>
              </div>


              {showSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-semibold">Registration Successful!</p>
                  <p className="text-sm text-gray-500 mt-2">Hope to see you there! 🎉</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {showEmailInput && (
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Any email address is accepted
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting || (showEmailInput && !email)}
                    >
                      {submitting ? 'Registering...' : showEmailInput ? 'Done' : 'REGISTER'}
                    </Button>

                    {showEmailInput && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setShowEmailInput(false)
                          setEmail('')
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAlreadyRegistered}
                    variant="outline"
                    className="w-full"
                    disabled={submitting}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Already Registered
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Registered elsewhere? Click to increase count
                  </p>
                </div>
              )}

              {event.registration_url && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Complete Registration Form
                  </a>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By registering, you'll receive updates about this event
                </p>
              </div>

              {canDelete && (
                <div className="mt-6 pt-6 border-t border-red-200">
                  <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                    Event Management
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDeleteEvent}
                    disabled={submitting}
                    className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {submitting ? 'Deleting...' : 'Delete Event'}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {isEventCreator ? 'Only you can see this option' : 'Admin/Event Management'}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EventDetail

