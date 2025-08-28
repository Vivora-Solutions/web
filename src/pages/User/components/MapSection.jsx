import { GoogleMap, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { useState, useMemo, useRef, useEffect } from "react"


const LIBRARIES = ["marker"]

const containerStyle = {
  width: "100%",
  height: "100%",
}

export default function MapSection({ center, zoom, filteredSalons, onSalonClick, className, userLocation }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES, 
  })

  const [selectedSalon, setSelectedSalon] = useState(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  const mapCenter = useMemo(
    () => ({ lat: center[0], lng: center[1] }),
    [center]
  )

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    // Clear old markers
    markersRef.current.forEach((marker) => (marker.map = null))
    markersRef.current = []

    // ✅ Add salon markers
    filteredSalons.forEach((salon) => {
      if (!salon.coordinates?.lat || !salon.coordinates?.lng) return

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: salon.coordinates.lat,
          lng: salon.coordinates.lng,
        },
        map: mapRef.current,
        title: salon.salon_name,
      })

      marker.addListener("click", () => {
        setSelectedSalon(salon)
        onSalonClick(salon.salon_id)
      })

      marker.addListener("mouseover", () => {
        setSelectedSalon(salon)
      })

      markersRef.current.push(marker)
    })

  // ✅ Add user location marker
  if (userLocation) {
    // Create a custom blue dot element
    const blueDot = document.createElement("div")
    blueDot.style.width = "16px"
    blueDot.style.height = "16px"
    blueDot.style.backgroundColor = "#4285F4" // Google blue
    blueDot.style.borderRadius = "50%"
    blueDot.style.border = "2px solid white"
    blueDot.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)"

    const userMarker = new google.maps.marker.AdvancedMarkerElement({
      position: userLocation,
      map: mapRef.current,
      title: "You are here",
      content: blueDot, // ✅ custom marker content
    })
    markersRef.current.push(userMarker)
  }

  }, [isLoaded, filteredSalons, onSalonClick, userLocation])

  if (loadError) return <div>Error loading map</div>
  if (!isLoaded) return <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mt-8 mb-4"></div>

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => (mapRef.current = map)}
      >
        {selectedSalon && (
          <InfoWindow
            position={{
              lat: selectedSalon.coordinates.lat,
              lng: selectedSalon.coordinates.lng,
            }}
            onCloseClick={() => setSelectedSalon(null)}
          >
            <div>
              <h3 className="font-semibold">{selectedSalon.salon_name}</h3>
              <p className="text-sm">{selectedSalon.salon_address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}
