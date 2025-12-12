import { Sparkles, MessageSquare } from 'lucide-react'
import EventAssistant from '../components/assistant/EventAssistant'
import RecentRequests from '../components/assistant/RecentRequests'
import { motion } from 'framer-motion'

const Assistant = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg mb-6 pulse-glow"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-bold">AI-Powered Event Request System</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
        >
          <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            AI Event Assistant
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto"
        >
          Request events for your society or club - Open to everyone! Our AI assistant will help route your request to the right team.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <MessageSquare className="w-4 h-4" />
          <span>All requests are visible to faculty and event organizers</span>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Chat Assistant - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <EventAssistant />
        </div>

        {/* Recent Requests Sidebar - Takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <RecentRequests />
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">AI-Powered</h3>
          </div>
          <p className="text-sm text-gray-600">
            Our AI automatically categorizes your request and routes it to the right team.
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Open to Everyone</h3>
          </div>
          <p className="text-sm text-gray-600">
            No login required! Anyone can request events for their society or club.
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">Transparent</h3>
          </div>
          <p className="text-sm text-gray-600">
            Recent requests are visible to everyone, so faculty can see what students want.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Assistant

