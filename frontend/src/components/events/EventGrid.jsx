import { useEvents } from '../../context/EventContext'
import EventCard from './EventCard'
import { Loader2 } from 'lucide-react'

const EventGrid = () => {
  const { events, loading } = useEvents()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No events found. Be the first to create one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  )
}

export default EventGrid

