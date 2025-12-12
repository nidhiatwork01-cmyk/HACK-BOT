import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns'
import { motion } from 'framer-motion'
import Card from '../ui/Card'

const CalendarWidget = ({ events, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get dates that have events
  const eventDates = events.map(event => event.date)

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = getDay(monthStart)
  
  // Create array with empty cells for days before month starts
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const hasEvent = (date) => {
    return eventDates.some(eventDate => isSameDay(new Date(eventDate), date))
  }

  const handleDateClick = (date) => {
    if (onDateClick) {
      onDateClick(date)
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card>
      <div className="p-4">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const isToday = isSameDay(day, new Date())
            const hasEventOnDay = hasEvent(day)
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday 
                    ? 'bg-blue-500 text-white font-bold' 
                    : hasEventOnDay
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'hover:bg-gray-100'
                  }
                  ${hasEventOnDay && !isToday ? 'ring-2 ring-blue-400 shadow-md' : ''}
                `}
                title={hasEventOnDay ? `${format(day, 'MMM dd')} - Has events` : format(day, 'MMM dd')}
              >
                {format(day, 'd')}
              </motion.button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-blue-100 ring-2 ring-blue-300"></div>
            <span className="text-gray-600">Has Events</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CalendarWidget

