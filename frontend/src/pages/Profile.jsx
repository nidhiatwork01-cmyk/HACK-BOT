import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, getUserEvents } from '../services/api'
import { Calendar, MapPin, Users, Mail, User, Award, Clock, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { motion } from 'framer-motion'

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  const userId = id ? parseInt(id) : currentUser?.id

  useEffect(() => {
    if (userId) {
      fetchProfile()
      fetchEvents()
    }
  }, [userId])

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile(userId)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const data = await getUserEvents(userId)
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryColors = {
    technical: 'bg-blue-100 text-blue-700',
    cultural: 'bg-purple-100 text-purple-700',
    sports: 'bg-green-100 text-green-700',
    academic: 'bg-orange-100 text-orange-700',
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

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Profile not found</p>
            <Button onClick={() => navigate('/events')} className="mt-4">
              Back to Events
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.user.name || 'User'}
              </h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile.user.email}</span>
                </div>
                {profile.user.role && (
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      profile.user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      profile.user.role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                      profile.user.role === 'ksac_member' ? 'bg-purple-100 text-purple-700' :
                      profile.user.role === 'society_president' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {profile.user.role.replace('_', ' ').toUpperCase()}
                    </span>
                    {profile.user.society_name && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                        {profile.user.society_name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{profile.stats.total_registrations}</div>
                <div className="text-xs text-gray-600">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{profile.stats.upcoming_events}</div>
                <div className="text-xs text-gray-600">Upcoming</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{profile.stats.past_events}</div>
                <div className="text-xs text-gray-600">Past</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Upcoming Events ({events.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'past'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-2" />
            Past Events ({events.past.length})
          </button>
        </div>

        {/* Events List */}
        {activeTab === 'upcoming' ? (
          events.upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.upcoming.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/events/${event.id}`)}>
                    {event.poster_url && (
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                          {event.category}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{format(new Date(`${event.date}T${event.time}`), 'MMM dd, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        {event.society && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-500" />
                            <span>{event.society}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Registered: {format(new Date(event.registered_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No upcoming events</p>
                <Button onClick={() => navigate('/events')} className="mt-4">
                  Browse Events
                </Button>
              </div>
            </Card>
          )
        ) : (
          events.past.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.past.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow opacity-75" onClick={() => navigate(`/events/${event.id}`)}>
                    {event.poster_url && (
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-t-lg mb-4"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                          {event.category}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{format(new Date(`${event.date}T${event.time}`), 'MMM dd, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Participated: {format(new Date(event.registered_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No past events</p>
                <p className="text-sm text-gray-400 mt-2">Start participating in events to build your profile!</p>
              </div>
            </Card>
          )
        )}
      </motion.div>
    </div>
  )
}

export default Profile

