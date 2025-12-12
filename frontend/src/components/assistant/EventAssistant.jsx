import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { submitEventRequest } from '../../services/assistant'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

const EventAssistant = () => {
  const { isAuthenticated, user } = useAuth()
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "👋 Hi! I'm your Event Assistant. I can help you request events for your society or club! Please tell me:\n\n1. What kind of event you want (e.g., hackathon, cultural fest, workshop)\n2. Which society or club you're from (e.g., Coding Club, Cultural Committee)\n\nWhat event would you like to request?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasSocietyInfo, setHasSocietyInfo] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    const newUserMessage = {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])
    setLoading(true)

    try {
      const response = await submitEventRequest(userMessage)
      
      // Check if society name was detected
      if (response.society_name) {
        setHasSocietyInfo(true)
      }
      
      // Add bot response
      const botMessage = {
        type: 'bot',
        text: response.auto_response,
        category: response.category,
        sentiment: response.sentiment,
        society_name: response.society_name,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      
      // If no society name, ask for it
      if (!response.society_name && !hasSocietyInfo) {
        setTimeout(() => {
          const followUpMessage = {
            type: 'bot',
            text: "💡 Tip: Please mention your society or club name in your request (e.g., 'Coding Club wants a hackathon' or 'from Cultural Committee'). This helps us route your request to the right team!",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, followUpMessage])
        }, 1000)
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      const errorMessage = {
        type: 'bot',
        text: error.message || 'Sorry, I encountered an error. Please check if the backend is running and try again.',
        isError: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Event Assistant</h3>
          <p className="text-xs text-gray-500">AI-powered event request helper</p>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : message.isError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  {message.category && (
                    <div className="mt-2 pt-2 border-t border-gray-300/30 space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                          {message.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                          {message.sentiment}
                        </span>
                        {message.society_name && (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            {message.society_name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., Coding Club wants a hackathon event..."
          className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
    </Card>
  )
}

export default EventAssistant

