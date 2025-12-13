/**
 * Utility functions for map and location services
 */

/**
 * Generate Google Maps directions URL
 * @param {string|object} destination - The destination address/venue name OR location object with coordinates
 * @param {string} origin - Optional origin address (if not provided, user's location will be used)
 * @returns {string} Google Maps directions URL
 */
export const getDirectionsUrl = (destination, origin = null) => {
  if (!destination) return null
  
  // If destination is an object with coordinates, use precise coordinates
  if (typeof destination === 'object' && destination.coordinates) {
    const dest = `${destination.coordinates.lat},${destination.coordinates.lng}`
    if (origin) {
      const encodedOrigin = encodeURIComponent(origin)
      return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${dest}`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
  }
  
  // If destination is an object with location data (from event)
  if (typeof destination === 'object' && destination.location_lat && destination.location_lng) {
    const dest = `${destination.location_lat},${destination.location_lng}`
    if (origin) {
      const encodedOrigin = encodeURIComponent(origin)
      return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${dest}`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
  }
  
  // Fallback to address search
  const encodedDestination = encodeURIComponent(typeof destination === 'string' ? destination : destination.address || destination.venue || '')
  
  // If origin is provided, include it in the URL
  if (origin) {
    const encodedOrigin = encodeURIComponent(origin)
    return `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDestination}`
  }
  
  // Otherwise, just use destination (Google Maps will prompt for origin)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`
}

/**
 * Generate Google Maps search URL (to view location on map)
 * @param {string} query - The location/venue to search for
 * @returns {string} Google Maps search URL
 */
export const getMapSearchUrl = (query) => {
  if (!query) return null
  const encodedQuery = encodeURIComponent(query)
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
}

/**
 * Generate embedded Google Maps iframe URL (requires API key for production)
 * For now, we'll use a simple embed without API key
 * @param {string} query - The location/venue to show
 * @returns {string} Google Maps embed URL
 */
export const getEmbeddedMapUrl = (query) => {
  if (!query) return null
  const encodedQuery = encodeURIComponent(query)
  // Using Google Maps embed without API key (basic version)
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4UZw1hF6w&q=${encodedQuery}`
}

/**
 * Open Google Maps directions in a new tab
 * @param {string|object} destination - The destination address/venue name OR location object with coordinates
 * @param {string} origin - Optional origin address
 */
export const openDirections = (destination, origin = null) => {
  const url = getDirectionsUrl(destination, origin)
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/**
 * Open Google Maps search in a new tab
 * @param {string} query - The location/venue to search for
 */
export const openMapSearch = (query) => {
  const url = getMapSearchUrl(query)
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

