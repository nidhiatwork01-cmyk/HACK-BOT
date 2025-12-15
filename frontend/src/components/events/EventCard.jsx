import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Calendar, MapPin, Users, ArrowRight, Lock, CheckCircle, ExternalLink, Navigation } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { registerEvent } from '../../services/api'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { openDirections } from '../../utils/maps'

const EventCard = ({ event, index = 0, onRegister }) => {
  const { isAuthenticated } = useAuth()
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const eventDate = new Date(`${event.date}T${event.time}`)
  const registrationCount = event.registration_count || 0
  
  const categoryColors = {
    technical: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg',
    cultural: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg',
    sports: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg',
    academic: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg',
  }
  
  const categoryGradients = {
    technical: 'from-blue-400 via-cyan-400 to-blue-500',
    cultural: 'from-purple-400 via-pink-400 to-purple-500',
    sports: 'from-green-400 via-emerald-400 to-green-500',
    academic: 'from-orange-400 via-red-400 to-orange-500',
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    if (event.registration_url) {
      // Open registration URL in new tab
      window.open(event.registration_url, '_blank')
    }

    setRegistering(true)
    try {
      const response = await registerEvent(event.id)
      setIsRegistered(true)
      setShowCongrats(true)
      if (onRegister) {
        onRegister(event.id, response.count)
      }
      setTimeout(() => setShowCongrats(false), 5000)
    } catch (error) {
      if (error.message && error.message.includes('Already registered')) {
        setIsRegistered(true)
      } else {
        alert(error.message || 'Failed to register')
      }
    } finally {
      setRegistering(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="h-full cursor-pointer overflow-hidden group relative">
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[event.category] || 'from-blue-400 to-indigo-500'} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
          
          {event.poster_url ? (
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg group-hover:shadow-xl transition-shadow">
              <img
                src={event.poster_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          ) : (
            <div className={`w-full h-48 rounded-xl mb-4 bg-gradient-to-br ${categoryGradients[event.category] || 'from-blue-400 to-indigo-500'} shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all`}>
              <Calendar className="w-16 h-16 text-white/80" />
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  {event.is_locked && (
                    <Lock className="w-4 h-4 text-yellow-600 flex-shrink-0" title="Password Protected" />
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                {event.category}
              </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {event.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{format(eventDate, 'MMM dd, yyyy')} at {format(eventDate, 'h:mm a')}</span>
              </div>
              
              <div className="flex items-center justify-between gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openDirections(event.venue)
                  }}
                  className="flex-shrink-0 p-1.5 rounded-md hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Get directions"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </button>
              </div>

              {event.society && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>{event.society}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-green-500" />
                <span>{registrationCount} registered</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <Link 
                to={`/events/${event.id}`}
                className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:text-purple-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {isAuthenticated && (
                <Button
                  onClick={handleRegister}
                  disabled={isRegistered || registering}
                  className={`text-xs px-4 py-1.5 ${
                    isRegistered 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  } text-white`}
                >
                  {registering ? (
                    'Registering...'
                  ) : isRegistered ? (
                    <>
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Registered
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Link>

      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCongrats(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h3>
              <p className="text-lg text-gray-700 mb-1">You're registered for</p>
              <p className="text-xl font-bold text-purple-600 mb-4">{event.title}</p>
              <p className="text-gray-600 mb-6">Hope to see you there! 🎊</p>
              {event.registration_url && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  Complete Registration
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Button
                onClick={() => setShowCongrats(false)}
                variant="outline"
                className="mt-4 w-full"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default EventCard

