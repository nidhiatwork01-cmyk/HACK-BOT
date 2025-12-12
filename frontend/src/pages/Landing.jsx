import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle2, Sparkles, Users, Clock, Bell, Search, TrendingUp, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'

const Landing = () => {
  const [college, setCollege] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const kiitVariations = [
    'kiit',
    'kalinga institute of industrial technology',
    'kalinga institute',
    'kiit university',
    'kalinga'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    const collegeLower = college.toLowerCase().trim()
    const isKIIT = kiitVariations.some(variation => collegeLower.includes(variation))
    
    if (isKIIT) {
      // Store college in sessionStorage for future reference
      sessionStorage.setItem('college', 'KIIT')
      navigate('/dashboard')
    } else {
      setError('This platform is currently available only for KIIT students. Please enter "KIIT" or "Kalinga Institute of Industrial Technology".')
    }
  }

  const benefits = [
    {
      icon: Calendar,
      title: 'Never Miss an Event',
      description: 'All campus events in one place. Filter by category, date, or venue.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Search,
      title: 'Easy Discovery',
      description: 'Find events that match your interests with smart filtering and search.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bell,
      title: 'Stay Updated',
      description: 'Get notified about upcoming events and never miss important deadlines.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'One-Click Registration',
      description: 'Register for events instantly with a single click. Track all your registrations.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Assistant',
      description: 'Request events for your society using our intelligent AI assistant.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Smart Recommendations',
      description: 'Get personalized event recommendations based on your interests.',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg mb-8 pulse-glow"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-bold">Campus Event Navigator</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight"
            >
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Events
              </span>
              <br />
              <span className="text-gray-800">Everywhere</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-3xl text-gray-700 mb-4 font-semibold"
            >
              Your One-Stop Portal for All Campus Events
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Never miss another hackathon, workshop, cultural fest, or seminar. 
              Discover, explore, and register for events that matter to you—all in one place.
            </motion.p>

            {/* College Selection Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-md mx-auto mb-16"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter your college name (e.g., KIIT or Kalinga Institute)"
                    value={college}
                    onChange={(e) => {
                      setCollege(e.target.value)
                      setError('')
                    }}
                    className="text-center text-lg py-4"
                    required
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 text-center"
                    >
                      This platform is currently available only for{' '}
                      <span className="font-bold text-green-600">KIIT</span> students. Please enter{' '}
                      <span className="font-semibold text-green-600">"KIIT"</span> or{' '}
                      <span className="font-semibold text-green-600">"Kalinga Institute of Industrial Technology"</span>.
                    </motion.p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-4 flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">How We Make Life Easier</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to stay connected with campus events, all in one platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Everything You Need in One Place
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Event Calendar</h3>
                <p className="text-blue-100 text-center">
                  Visual calendar view with all upcoming events highlighted
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
                <p className="text-blue-100 text-center">
                  Request events for your society with intelligent AI routing
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Analytics</h3>
                <p className="text-blue-100 text-center">
                  Get recommendations and see trending event categories
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="gradient-text">Ready to Get Started?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who never miss an event. Enter your college name above to begin.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Free to use</span>
            <span>•</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>No registration required to browse</span>
            <span>•</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>AI-powered recommendations</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Landing

