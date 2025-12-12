import { useState, useEffect } from 'react'
import { MessageSquare, Calendar, Users, TrendingUp } from 'lucide-react'
import { getRecentRequests } from '../../services/assistant'
import Card from '../ui/Card'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'

const RecentRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
    
    // Auto-refresh every 5 seconds to show new requests
    const interval = setInterval(() => {
      fetchRequests()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async () => {
    try {
      const data = await getRecentRequests()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-700',
      cultural: 'bg-purple-100 text-purple-700',
      sports: 'bg-green-100 text-green-700',
      academic: 'bg-orange-100 text-orange-700',
      general: 'bg-gray-100 text-gray-700'
    }
    return colors[category] || colors.general
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

  if (requests.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent requests in the last 20 days</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Recent Event Requests</h3>
          <p className="text-xs text-gray-500">Last 20 days • {requests.length} requests</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {requests.map((req, index) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium mb-1">{req.request_text}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(req.category_detected)}`}>
                    {req.category_detected}
                  </span>
                  {req.society_name && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {req.society_name}
                    </span>
                  )}
                  {req.user_name && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {req.user_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default RecentRequests

