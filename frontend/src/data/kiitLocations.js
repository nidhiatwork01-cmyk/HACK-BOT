/**
 * Real KIIT University Locations in Bhubaneswar, India
 * With precise addresses and coordinates for accurate navigation
 */

export const KIIT_LOCATIONS = [
  {
    id: 'kiit_main_auditorium',
    name: 'KIIT Main Auditorium',
    address: 'KIIT Main Auditorium, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3525,
      lng: 85.8179
    },
    description: 'Main auditorium for large events and conferences',
    category: 'venue'
  },
  {
    id: 'kiit_convention_centre',
    name: 'KIIT Convention Centre',
    address: 'KIIT Convention Centre, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3530,
      lng: 85.8185
    },
    description: 'Convention center for cultural events and gatherings',
    category: 'venue'
  },
  {
    id: 'kiit_sports_complex',
    name: 'KIIT Sports Complex',
    address: 'KIIT Sports Complex, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3510,
      lng: 85.8165
    },
    description: 'Sports complex with multiple courts and fields',
    category: 'sports'
  },
  {
    id: 'kiit_library',
    name: 'KIIT Central Library',
    address: 'KIIT Central Library, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3520,
      lng: 85.8175
    },
    description: 'Central library for academic and literary events',
    category: 'academic'
  },
  {
    id: 'kiit_school_cse',
    name: 'KIIT School of Computer Engineering',
    address: 'KIIT School of Computer Engineering, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3515,
      lng: 85.8180
    },
    description: 'Computer Science and Engineering building',
    category: 'academic'
  },
  {
    id: 'kiit_school_management',
    name: 'KIIT School of Management',
    address: 'KIIT School of Management, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3535,
      lng: 85.8190
    },
    description: 'Business School and Management building',
    category: 'academic'
  },
  {
    id: 'kiit_innovation_lab',
    name: 'KIIT Innovation Lab',
    address: 'KIIT Innovation Lab, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3528,
      lng: 85.8182
    },
    description: 'Innovation and research laboratory',
    category: 'technical'
  },
  {
    id: 'kiit_student_activity',
    name: 'KIIT Student Activity Centre',
    address: 'KIIT Student Activity Centre, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3518,
      lng: 85.8172
    },
    description: 'Student activity center for clubs and societies',
    category: 'venue'
  },
  {
    id: 'kiit_auditorium_campus7',
    name: 'KIIT Auditorium - Campus 7',
    address: 'KIIT Auditorium, Campus 7, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3540,
      lng: 85.8195
    },
    description: 'Auditorium in Campus 7',
    category: 'venue'
  },
  {
    id: 'kiit_main_gate',
    name: 'KIIT Main Gate',
    address: 'KIIT University Main Gate, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3500,
      lng: 85.8160
    },
    description: 'Main entrance to KIIT University',
    category: 'landmark'
  },
  {
    id: 'kiit_cafeteria',
    name: 'KIIT Cafeteria',
    address: 'KIIT Cafeteria, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3522,
      lng: 85.8178
    },
    description: 'Main cafeteria and food court',
    category: 'venue'
  },
  {
    id: 'kiit_hostel_block',
    name: 'KIIT Hostel Block',
    address: 'KIIT Hostel Block, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3505,
      lng: 85.8165
    },
    description: 'Student hostel area',
    category: 'residential'
  },
  {
    id: 'kiit_admin_building',
    name: 'KIIT Administrative Building',
    address: 'KIIT Administrative Building, KIIT University, Patia, Bhubaneswar, Odisha 751024',
    coordinates: {
      lat: 20.3527,
      lng: 85.8185
    },
    description: 'Main administrative building',
    category: 'administrative'
  }
]

/**
 * Get location by ID
 */
export const getLocationById = (id) => {
  return KIIT_LOCATIONS.find(loc => loc.id === id)
}

/**
 * Get locations by category
 */
export const getLocationsByCategory = (category) => {
  return KIIT_LOCATIONS.filter(loc => loc.category === category)
}

/**
 * Search locations by name
 */
export const searchLocations = (query) => {
  const lowerQuery = query.toLowerCase()
  return KIIT_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(lowerQuery) ||
    loc.address.toLowerCase().includes(lowerQuery) ||
    loc.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get Google Maps URL with coordinates
 */
export const getLocationMapUrl = (location) => {
  if (location.coordinates) {
    return `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`
}

/**
 * Get Google Maps directions URL with coordinates
 */
export const getLocationDirectionsUrl = (location, origin = null) => {
  if (location.coordinates) {
    const dest = `${location.coordinates.lat},${location.coordinates.lng}`
    if (origin) {
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest}`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
  }
  // Fallback to address search
  const dest = encodeURIComponent(location.address)
  if (origin) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest}`
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}

