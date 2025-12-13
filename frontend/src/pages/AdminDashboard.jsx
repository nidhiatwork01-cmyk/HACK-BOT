import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, CheckCircle, Clock, TrendingUp, Filter, Send, Loader2, Shield, AlertCircle, X, Plus, Ban } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getEventRequests, respondToRequest, getAssistantStats } from '../services/assistant'
import { getBannedWords, addBannedWord, removeBannedWord } from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Textarea from '../components/ui/Textarea'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const allowedRoles = ['faculty', 'ksac_member', 'society_president', 'admin']
  const [requests, setRequests] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [responding, setResponding] = useState(false)
  const [activeTab, setActiveTab] = useState('requests') // 'requests' or 'banned-words'
  const [bannedWords, setBannedWords] = useState([])
  const [newWord, setNewWord] = useState('')
  const [newWordReason, setNewWordReason] = useState('')
  const [addingWord, setAddingWord] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (!user || !allowedRoles.includes(user.role)) {
      // User doesn't have access
      return
    }
    
    fetchData()
  }, [filter, isAuthenticated, user])

  const fetchData = async () => {
    try {
      const [requestsData, statsData, bannedWordsData] = await Promise.all([
        getEventRequests(filter),
        getAssistantStats(),
        getBannedWords().catch(() => []) // Don't fail if not admin
      ])
      setRequests(requestsData)
      setStats(statsData)
      setBannedWords(bannedWordsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBannedWord = async () => {
    if (!newWord.trim()) {
      alert('Please enter a word to ban')
      return
    }

    setAddingWord(true)
    try {
      await addBannedWord(newWord.trim(), newWordReason.trim())
      setNewWord('')
      setNewWordReason('')
      await fetchData()
      alert('Banned word added successfully!')
    } catch (error) {
      alert('Failed to add banned word: ' + error.message)
    } finally {
      setAddingWord(false)
    }
  }

  const handleRemoveBannedWord = async (wordId) => {
    if (!window.confirm('Are you sure you want to remove this banned word?')) {
      return
    }

    try {
      await removeBannedWord(wordId)
      await fetchData()
      alert('Banned word removed successfully!')
    } catch (error) {
      alert('Failed to remove banned word: ' + error.message)
    }
  }

  const handleRespond = async () => {
    if (!responseText.trim() || !selectedRequest) return

    setResponding(true)
    try {
      await respondToRequest(selectedRequest.id, responseText)
      setResponseText('')
      setSelectedRequest(null)
      await fetchData()
    } catch (error) {
      alert('Failed to submit response: ' + error.message)
    } finally {
      setResponding(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'responded': return 'bg-green-100 text-green-700'
      case 'approved': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
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

  if (!isAuthenticated) {
    return null
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need privileged access (Faculty, KSAC Member, or Society President) to view this page.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/privileged-register')}>
                <Shield className="w-4 h-4" />
                Register as Privileged User
              </Button>
              <p className="text-sm text-gray-500">
                Contact administration for secret keys
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">
              <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-gray-600">
              Manage event requests from students
              {user.role && (
                <span className="ml-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                  {user.role.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Privileged Access</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card gradient>
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.total_requests}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
          </Card>
          <Card gradient>
            <div className="text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{stats.pending_requests}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </Card>
          <Card gradient>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {stats.total_requests - stats.pending_requests}
              </p>
              <p className="text-sm text-gray-600">Responded</p>
            </div>
          </Card>
          <Card gradient>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {Object.keys(stats.category_stats || {}).length}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Event Requests
        </button>
        <button
          onClick={() => setActiveTab('banned-words')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'banned-words'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Ban className="w-4 h-4 inline mr-2" />
          Banned Words
        </button>
      </div>

      {/* Filter (only show for requests tab) */}
      {activeTab === 'requests' && (
        <div className="mb-6 flex items-center gap-4">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      )}

      {/* Banned Words Management */}
      {activeTab === 'banned-words' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Ban className="w-6 h-6 text-red-500" />
              Manage Banned Words
            </h2>
            <p className="text-gray-600 mb-6">
              Words added here will prevent users from creating events with inappropriate content.
            </p>

            {/* Add New Banned Word */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Add New Banned Word</h3>
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Enter word to ban (case-insensitive)"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Reason (optional)"
                    value={newWordReason}
                    onChange={(e) => setNewWordReason(e.target.value)}
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAddBannedWord}
                  disabled={addingWord || !newWord.trim()}
                  className="w-full"
                >
                  {addingWord ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Banned Word
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Banned Words List */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Banned Words ({bannedWords.length})
              </h3>
              {bannedWords.length === 0 ? (
                <Card>
                  <div className="text-center py-8">
                    <Ban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No banned words yet</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-2">
                  {bannedWords.map((word) => (
                    <Card key={word.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-red-600 text-lg">{word.word}</span>
                          {word.reason && (
                            <span className="text-sm text-gray-600">- {word.reason}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          {word.added_by_email && (
                            <span>Added by: {word.added_by_email}</span>
                          )}
                          <span>
                            {format(new Date(word.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveBannedWord(word.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Requests List (only show for requests tab) */}
      {activeTab === 'requests' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {requests.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No requests found</p>
              </div>
            </Card>
          ) : (
            requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedRequest?.id === req.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedRequest(req)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{req.user_name || req.user_email}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{req.request_text}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(req.category_detected)}`}>
                      {req.category_detected}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {req.sentiment}
                    </span>
                  </div>

                  {req.auto_response && (
                    <div className="p-3 bg-blue-50 rounded-lg mb-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">AI Response:</p>
                      <p className="text-sm text-blue-900">{req.auto_response}</p>
                    </div>
                  )}

                  {req.admin_response && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs font-semibold text-green-700 mb-1">Your Response:</p>
                      <p className="text-sm text-green-900">{req.admin_response}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(req.created_at), 'MMM dd, yyyy h:mm a')}
                  </p>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Response Panel */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <Card className="sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Respond to Request</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Student Request:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedRequest.request_text}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">AI Analysis:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Category:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(selectedRequest.category_detected)}`}>
                        {selectedRequest.category_detected}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Sentiment:</span>
                      <span className="text-xs font-semibold text-gray-700">{selectedRequest.sentiment}</span>
                    </div>
                  </div>
                </div>

                {selectedRequest.auto_response && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">AI Auto-Response:</p>
                    <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {selectedRequest.auto_response}
                    </p>
                  </div>
                )}

                <div>
                  <Textarea
                    label="Your Response"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response to the student..."
                    rows={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleRespond}
                    disabled={!responseText.trim() || responding}
                    className="flex-1"
                  >
                    {responding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Response
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(null)
                      setResponseText('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a request to respond</p>
              </div>
            </Card>
          )}
        </div>
      </div>
      )}
    </div>
  )
}

export default AdminDashboard

