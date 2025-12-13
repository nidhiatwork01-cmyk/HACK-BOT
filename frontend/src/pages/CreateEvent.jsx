import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useAuth } from '../context/AuthContext'
import { Calendar, MapPin, FileText, Image as ImageIcon, Lock, TrendingUp, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import { motion } from 'framer-motion'
import { predictEventPopularity, enhanceDescription, predictEventSuccess } from '../services/ml'

const CreateEvent = () => {
  const navigate = useNavigate()
  const { addEvent } = useEvents()
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    date: '',
    time: '',
    venue: '',
    poster_url: '',
    registration_url: '',
    society: '',
    event_password: '',
  })
  const [lockEvent, setLockEvent] = useState(false)
  const [popularityPrediction, setPopularityPrediction] = useState(null)
  const [predicting, setPredicting] = useState(false)
  const [descriptionAnalysis, setDescriptionAnalysis] = useState(null)
  const [successPrediction, setSuccessPrediction] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Analyze description and predict success when form data changes
  useEffect(() => {
    const analyze = async () => {
      if (formData.title && formData.category && formData.date) {
        setAnalyzing(true)
        try {
          // Analyze description quality
          if (formData.description) {
            const analysis = await enhanceDescription(
              formData.description,
              formData.title,
              formData.category,
              formData.date,
              formData.venue
            )
            setDescriptionAnalysis(analysis)
          }

          // Predict event success
          const success = await predictEventSuccess({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            date: formData.date,
            time: formData.time,
            venue: formData.venue,
            society: formData.society
          })
          setSuccessPrediction(success)

          // Also get popularity prediction
          const popularity = await predictEventPopularity({
            category: formData.category,
            date: formData.date,
            description: formData.description,
            society: formData.society
          })
          setPopularityPrediction(popularity)
        } catch (error) {
          console.error('Error analyzing:', error)
        } finally {
          setAnalyzing(false)
        }
      }
    }

    // Debounce analysis
    const timer = setTimeout(analyze, 800)
    return () => clearTimeout(timer)
  }, [formData.title, formData.category, formData.date, formData.description, formData.society, formData.venue, formData.time])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const eventData = { ...formData }
      if (!lockEvent) {
        delete eventData.event_password
      }
      await addEvent(eventData, token)
      navigate('/events')
    } catch (error) {
      console.error('Error:', error)
      // Show special message for banned words
      if (error.violates_rules) {
        alert(`❌ ${error.message}\n\n${error.details || 'Please review your event content and remove any inappropriate language.'}`)
      } else {
        alert(error.message || 'Failed to create event. Please check if the backend is running on port 5000.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Share your event with the campus community</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Event Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Hackathon 2024"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description
                {descriptionAnalysis && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                    descriptionAnalysis.grade === 'A' ? 'bg-green-100 text-green-700' :
                    descriptionAnalysis.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                    descriptionAnalysis.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Grade: {descriptionAnalysis.grade} ({descriptionAnalysis.score}/100)
                  </span>
                )}
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows={5}
                required
              />
              {descriptionAnalysis && descriptionAnalysis.suggestions.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-1">💡 AI Suggestions:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    {descriptionAnalysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                      <li key={idx}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              {descriptionAnalysis?.enhanced_description && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-900 mb-1">✨ Enhanced Description:</p>
                  <p className="text-xs text-green-800 italic mb-2">{descriptionAnalysis.enhanced_description}</p>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, description: descriptionAnalysis.enhanced_description })}
                    className="text-xs text-green-700 hover:text-green-900 font-semibold underline"
                  >
                    Use this description
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Category
                </label>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                </Select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Venue
                </label>
                <Input
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Main Auditorium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Time
                </label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4" />
                Poster URL (Optional)
              </label>
              <Input
                type="url"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Registration URL (Optional)
              </label>
              <Input
                type="url"
                name="registration_url"
                value={formData.registration_url}
                onChange={handleChange}
                placeholder="https://forms.google.com/..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Link where people can register for this event
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Organizing Society (Optional)
              </label>
              <Input
                name="society"
                value={formData.society}
                onChange={handleChange}
                placeholder="e.g., Coding Club"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="lockEvent"
                  checked={lockEvent}
                  onChange={(e) => setLockEvent(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="lockEvent" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <Lock className="w-4 h-4" />
                  Lock this event with a password
                </label>
              </div>
              {lockEvent && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4" />
                    Event Password
                  </label>
                  <Input
                    type="password"
                    name="event_password"
                    value={formData.event_password}
                    onChange={handleChange}
                    placeholder="Set a password to protect your event"
                    required={lockEvent}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Only people with this password can register for your event
                  </p>
                </div>
              )}
            </div>

            {/* ML Success Prediction - BIG CARD */}
            {successPrediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-xl border-2 ${
                  successPrediction.color === 'green' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' :
                  successPrediction.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' :
                  successPrediction.color === 'yellow' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' :
                  'bg-gradient-to-br from-red-50 to-pink-50 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    successPrediction.color === 'green' ? 'bg-green-500' :
                    successPrediction.color === 'blue' ? 'bg-blue-500' :
                    successPrediction.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">🤖 AI Event Success Score</h4>
                    <p className="text-xs text-gray-600">ML-powered prediction</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className={`text-4xl font-extrabold ${
                      successPrediction.color === 'green' ? 'text-green-600' :
                      successPrediction.color === 'blue' ? 'text-blue-600' :
                      successPrediction.color === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {successPrediction.success_score}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Success Score</p>
                    <p className="text-xs font-bold text-gray-700 mt-1">{successPrediction.level}</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className={`text-4xl font-extrabold ${
                      successPrediction.color === 'green' ? 'text-green-600' :
                      successPrediction.color === 'blue' ? 'text-blue-600' :
                      successPrediction.color === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {successPrediction.predicted_registrations}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Predicted Registrations</p>
                  </div>
                </div>
                {successPrediction.recommendations && successPrediction.recommendations.length > 0 && (
                  <div className="mt-4 p-3 bg-white/80 rounded-lg">
                    <p className="text-xs font-semibold text-gray-900 mb-2">💡 Recommendations:</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {successPrediction.recommendations.map((rec, idx) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* ML Popularity Prediction */}
            {popularityPrediction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-gray-900">ML Popularity Prediction</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-purple-600 mb-1">
                      {popularityPrediction.popularity_score}%
                    </div>
                    <p className="text-xs text-gray-600">Popularity Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">
                      {popularityPrediction.predicted_registrations}
                    </div>
                    <p className="text-xs text-gray-600">Predicted Registrations</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold mb-1 ${
                      popularityPrediction.confidence === 'high' ? 'text-green-600' :
                      popularityPrediction.confidence === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {popularityPrediction.confidence.toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-600">Confidence</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Based on category, timing, and event details
                </p>
              </motion.div>
            )}

            {analyzing && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-xs text-blue-700">🤖 AI is analyzing your event...</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default CreateEvent

