import { useState } from 'react'
import { MapPin, Search, X, Check } from 'lucide-react'
import { KIIT_LOCATIONS, searchLocations } from '../../data/kiitLocations'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'

const LocationPicker = ({ selectedLocation, onLocationSelect, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredLocations = searchQuery
    ? searchLocations(searchQuery)
    : KIIT_LOCATIONS

  const handleSelect = (location) => {
    onLocationSelect(location)
    setShowDropdown(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    onClear()
    setSearchQuery('')
    setShowDropdown(false)
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4 text-blue-500" />
        Select KIIT Location (Precise Navigation)
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Admin Only</span>
      </label>
      
      {selectedLocation ? (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-900">{selectedLocation.name}</span>
              </div>
              <p className="text-sm text-green-700">{selectedLocation.address}</p>
              <p className="text-xs text-green-600 mt-1">{selectedLocation.description}</p>
              {selectedLocation.coordinates && (
                <p className="text-xs text-gray-500 mt-1">
                  📍 Coordinates: {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search KIIT locations (e.g., Auditorium, Library, Sports Complex)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              className="pl-10"
            />
          </div>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <Card className="absolute z-20 w-full mt-2 max-h-96 overflow-y-auto shadow-lg">
                <div className="p-2">
                  {filteredLocations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No locations found matching "{searchQuery}"
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleSelect(location)}
                          className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900">{location.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{location.address}</p>
                              <p className="text-xs text-gray-500 mt-1">{location.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 Select a precise KIIT location for accurate navigation. Students will get exact directions to this location.
      </p>
    </div>
  )
}

export default LocationPicker

