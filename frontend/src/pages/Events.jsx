import FilterBar from '../components/events/FilterBar'
import EventGrid from '../components/events/EventGrid'
import { motion } from 'framer-motion'

const Events = () => {
  const isKIIT = sessionStorage.getItem('college') === 'KIIT'
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-extrabold mb-3">
          <span className="gradient-text">All Events</span>
        </h1>
        <p className="text-lg text-gray-600">
          Discover and explore all campus events{isKIIT ? (
            <span className="ml-1 font-semibold text-green-600">at <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">KIIT</span></span>
          ) : ''}
        </p>
      </motion.div>

      <FilterBar />
      <EventGrid />
    </div>
  )
}

export default Events

