import { useEvents } from '../context/EventContext'
import { format, isSameDay, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import CalendarWidget from '../components/calendar/CalendarWidget'
import { motion } from 'framer-motion'
import { useState } from 'react'

const Calendar = () => {
  const { events } = useEvents()
  const [selectedDate, setSelectedDate] = useState(null)

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})

  const sortedDates = Object.keys(eventsByDate).sort()

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setSelectedDate(dateStr)
    
    // Scroll to that date's events
    const element = document.getElementById(`date-${dateStr}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Highlight briefly
      element.classList.add('ring-2', 'ring-blue-400')
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-400')
      }, 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-extrabold mb-3">
          <span className="gradient-text">Event Calendar</span>
        </h1>
        <p className="text-lg text-gray-600">View all events organized by date</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Events List */}
        <div className="lg:col-span-2">
          {sortedDates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No events scheduled</p>
          </div>
        </Card>
      ) : (
            <div className="space-y-8">
              {sortedDates.map((date, index) => {
                const dateObj = parseISO(date)
                const dayEvents = eventsByDate[date]

                return (
                  <motion.div
                    key={date}
                    id={`date-${date}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="transition-all duration-300"
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {format(dateObj, 'EEEE, MMMM dd, yyyy')}
                      </h2>
                      <p className="text-gray-600">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</p>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dayEvents.map((event) => {
                    const eventDate = new Date(`${event.date}T${event.time}`)
                    const categoryColors = {
                      technical: 'bg-blue-100 text-blue-700',
                      cultural: 'bg-purple-100 text-purple-700',
                      sports: 'bg-green-100 text-green-700',
                      academic: 'bg-orange-100 text-orange-700',
                    }

                    return (
                      <Link key={event.id} to={`/events/${event.id}`}>
                        <Card className="cursor-pointer h-full" hover>
                          <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                              {event.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                              {event.category}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{format(eventDate, 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                        </div>
                        </Card>
                      </Link>
                    )
                  })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        </div>

        {/* Calendar Widget Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CalendarWidget events={events} onDateClick={handleDateClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar

