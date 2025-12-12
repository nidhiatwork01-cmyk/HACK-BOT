import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2, Lock, AlertCircle, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { getEvent, registerEvent, getRegistrations, markAsRegistered } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState(0)
  const [eventPassword, setEventPassword] = useState('')
  const [registered, setRegistered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)
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

    // If event is locked, show password input first
    if (event?.is_locked === 1 && !showPasswordInput) {
      setShowPasswordInput(true)
      return
    }

    setSubmitting(true)
    setPasswordError('')

    try {
      await registerEvent(id, event?.is_locked === 1 ? eventPassword : null, email)
      setRegistered(true)
      setRegistrations(prev => prev + 1)
      setEventPassword('')
      setShowPasswordInput(false)
      setShowEmailInput(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      if (error.requiresPassword) {
        setPasswordError(error.message || 'Incorrect password')
      } else {
        alert(error.message || 'Registration failed. You may already be registered.')
      }
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
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                  {event.category}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{format(eventDate, 'EEEE, MMMM dd, yyyy')} at {format(eventDate, 'h:mm a')}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{event.venue}</span>
                </div>

                {event.society && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">Organized by {event.society}</span>
                  </div>
                )}
              </div>

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

                    {event.is_locked === 1 && showPasswordInput && (
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Lock className="w-4 h-4" />
                          Event Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter event password"
                          value={eventPassword}
                          onChange={(e) => {
                            setEventPassword(e.target.value)
                            setPasswordError('')
                          }}
                          required={event.is_locked === 1}
                        />
                        {passwordError && (
                          <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                        )}
                      </div>
                    )}
                    
                    {event.is_locked === 1 && !showPasswordInput && showEmailInput ? (
                      <Button
                        type="button"
                        onClick={() => setShowPasswordInput(true)}
                        className="w-full"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Enter Password to Register
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting || (showEmailInput && !email) || (event.is_locked === 1 && showPasswordInput && !eventPassword)}
                      >
                        {submitting ? 'Registering...' : showEmailInput ? 'Submit Registration' : 'REGISTER'}
                      </Button>
                    )}

                    {showEmailInput && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setShowEmailInput(false)
                          setEmail('')
                          setShowPasswordInput(false)
                          setEventPassword('')
                          setPasswordError('')
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
                  {event.is_locked === 1
                    ? 'This event requires a password to register'
                    : 'By registering, you\'ll receive updates about this event'
                  }
                </p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EventDetail

