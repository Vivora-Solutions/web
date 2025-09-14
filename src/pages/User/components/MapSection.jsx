import { GoogleMap, OverlayView } from "@react-google-maps/api"
import { useState, useMemo, useRef, useEffect } from "react"
import { useGoogleMapsLoader } from "../../../utils/googleMapsLoader"
import CustomSalonMarker from "../../../components/CustomSalonMarker"

const containerStyle = {
  width: "100%",
  height: "100%",
}

export default function MapSection({
  center,
  zoom,
  filteredSalons,
  onSalonClick,
  className,
  userLocation,
}) {
  // Use shared Google Maps loader
  const { isLoaded, loadError } = useGoogleMapsLoader()

  const [hoveredSalon, setHoveredSalon] = useState(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)

  // Update currentZoom when zoom prop changes
  useEffect(() => {
    setCurrentZoom(zoom)
  }, [zoom])
  const mapRef = useRef(null)

  const mapCenter = useMemo(
    () => ({ lat: center[0], lng: center[1] }),
    [center]
  )

  const handleSalonClick = (salon) => {
    if (onSalonClick) {
      onSalonClick(salon.salon_id)
    }
  }

  const handleSalonHover = (salon) => {
    setHoveredSalon(salon)
  }

  const handleSalonLeave = () => {
    setHoveredSalon(null)
  }

  if (loadError) return <div>Error loading map</div>
  if (!isLoaded)
    return (
      <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mt-8 mb-4"></div>
    )

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
          zoomControl: true,
          scaleControl: false,
          rotateControl: false,
          keyboardShortcuts: false,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: "auto"
        }}
        onLoad={(map) => (mapRef.current = map)}
        onZoomChanged={() => {
          if (mapRef.current) {
            setCurrentZoom(mapRef.current.getZoom())
          }
        }}
      >
        {/* Custom Salon Markers */}
        {filteredSalons.map((salon) => {
          if (!salon.coordinates?.lat || !salon.coordinates?.lng) return null;
          
          return (
            <OverlayView
              key={salon.salon_id}
              position={{
                lat: salon.coordinates.lat,
                lng: salon.coordinates.lng,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={() => ({
                x: -8, // Fixed offset based on dot center (4px radius + 2px border = 8px from left)
                y: -8, // Fixed offset based on dot center (4px radius + 2px border = 8px from top)
              })}
            >
              <CustomSalonMarker
                salon={salon}
                zoom={currentZoom}
                isHovered={hoveredSalon?.salon_id === salon.salon_id}
                onMouseEnter={() => handleSalonHover(salon)}
                onMouseLeave={handleSalonLeave}
                onClick={() => handleSalonClick(salon)}
              />
            </OverlayView>
          );
        })}

        {/* User Location Marker */}
        {userLocation && (
          <OverlayView
            position={userLocation}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height / 2),
            })}
          >
            <div
              className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative"
              title="You are here"
            >
              <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
            </div>
          </OverlayView>
        )}


      </GoogleMap>
    </div>
  )
}
