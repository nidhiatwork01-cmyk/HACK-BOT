import { Link } from 'react-router-dom'
import { Calendar, TrendingUp, Users, Sparkles } from 'lucide-react'
import { useEvents } from '../context/EventContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EventCard from '../components/events/EventCard'
import KIITShowcase from '../components/home/KIITShowcase'
import MLDashboard from '../components/ml/MLDashboard'
import { motion } from 'framer-motion'

const Home = () => {
  const { events, stats } = useEvents()
  const upcomingEvents = events.slice(0, 6)
  
  // Check if KIIT was selected from landing page
  const isKIIT = sessionStorage.getItem('college') === 'KIIT'

  const statsData = [
    { icon: Calendar, label: 'Total Events', value: stats?.total_events || 0, color: 'text-blue-500' },
    { icon: Users, label: 'Registrations', value: stats?.total_registrations || 0, color: isKIIT ? 'text-green-600' : 'text-green-500' },
    { icon: TrendingUp, label: 'Active', value: events.length, color: 'text-purple-500' },
  ]

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isKIIT ? 'relative' : ''}`}>
      {isKIIT && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-30"></div>
      )}
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
            isKIIT 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          } text-white shadow-lg mb-6 pulse-glow`}
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-bold">Never Miss an Event Again{isKIIT ? ' at KIIT' : ''}</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
        >
          <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Discover
          </span>
          <br />
          <span className="text-gray-800">
            Campus Events{isKIIT ? (
              <span className="ml-2 font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                at KIIT
              </span>
            ) : ''}
          </span>
        </motion.h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your one-stop portal for all campus events{isKIIT ? (
            <span className="ml-1">at <span className="font-semibold text-green-600">KIIT</span></span>
          ) : ''}. Find, explore, and register for events that matter to you.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/events">
            <Button size="lg">Explore Events</Button>
          </Link>
          <Link to="/create">
            <Button variant="outline" size="lg">Create Event</Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card gradient className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${
                    stat.color.includes('blue') 
                      ? 'from-blue-500 to-cyan-500' 
                      : stat.color.includes('green') 
                        ? (isKIIT ? 'from-green-600 to-emerald-600' : 'from-green-500 to-emerald-500')
                        : 'from-purple-500 to-pink-500'
                  } shadow-lg ${isKIIT && stat.color.includes('green') ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                    <p className="text-sm font-semibold text-gray-600 mt-1">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* KIIT Showcase Section */}
      <KIITShowcase />

      {/* AI Event Assistant Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-3">
            <span className="gradient-text">AI Event Assistant</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Request events for your society or club - Open to everyone!
          </p>
          <Link to="/assistant">
            <Button size="lg" className="inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>Open AI Assistant</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ML Analytics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-16"
      >
        <MLDashboard />
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-extrabold">
            <span className="gradient-text">Upcoming Events</span>
          </h2>
          <Link to="/events">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No events yet</p>
              <Link to="/create">
                <Button>Create First Event</Button>
              </Link>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

export default Home

