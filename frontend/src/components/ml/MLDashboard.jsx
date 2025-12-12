import { useState, useEffect } from 'react'
import { TrendingUp, Sparkles, Target, BarChart3, Zap } from 'lucide-react'
import { getTrendingCategories, getRecommendations, predictEventPopularity } from '../../services/ml'
import Card from '../ui/Card'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const MLDashboard = () => {
  const { isAuthenticated } = useAuth()
  const [trending, setTrending] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
    if (isAuthenticated) {
      fetchRecommendations()
    }
  }, [isAuthenticated])

  const fetchTrending = async () => {
    try {
      const data = await getTrendingCategories()
      setTrending(data.trending || [])
    } catch (error) {
      console.error('Error fetching trending:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'hot': return 'bg-red-100 text-red-700 border-red-300'
      case 'rising': return 'bg-orange-100 text-orange-700 border-orange-300'
      default: return 'bg-blue-100 text-blue-700 border-blue-300'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'hot': return '🔥'
      case 'rising': return '📈'
      default: return '📊'
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">ML-Powered Insights</span>
        </div>
        <h2 className="text-3xl font-extrabold mb-2">
          <span className="gradient-text">AI Analytics Dashboard</span>
        </h2>
        <p className="text-gray-600">Real-time trends and personalized recommendations</p>
      </div>

      {/* Trending Categories */}
      <Card gradient>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Trending Categories</h3>
            <p className="text-sm text-gray-600">Most requested event types (Last 30 days)</p>
          </div>
        </div>

        <div className="space-y-3">
          {trending.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No trending data yet</p>
          ) : (
            trending.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getTrendColor(item.trend)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTrendIcon(item.trend)}</span>
                    <div>
                      <p className="font-bold text-lg capitalize">{item.category}</p>
                      <p className="text-sm opacity-75">
                        {item.request_count} requests • {item.event_count} events
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold">{item.trend_score}</p>
                    <p className="text-xs opacity-75">Trend Score</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Personalized Recommendations */}
      {isAuthenticated && recommendations.length > 0 && (
        <Card gradient>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
              <p className="text-sm text-gray-600">AI-powered personalized suggestions</p>
            </div>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{rec.title}</p>
                    <p className="text-sm text-gray-600 mb-2">{rec.description?.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {rec.category}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {rec.venue}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1 text-purple-600 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="text-lg font-bold">{Math.round(rec.confidence * 100)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">Match</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ML Features Info */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-900 mb-1">Trend Analysis</h4>
            <p className="text-xs text-gray-600">Real-time category trends</p>
          </div>
          <div className="text-center p-4">
            <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-900 mb-1">Smart Recommendations</h4>
            <p className="text-xs text-gray-600">Personalized event suggestions</p>
          </div>
          <div className="text-center p-4">
            <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-900 mb-1">Popularity Prediction</h4>
            <p className="text-xs text-gray-600">ML-powered forecasting</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MLDashboard

