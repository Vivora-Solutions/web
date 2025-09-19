import { GoogleMap, OverlayView } from "@react-google-maps/api"
import { useState, useMemo, useRef, useEffect } from "react"
import { useGoogleMapsLoader } from "../../../utils/googleMapsLoader"
import CustomSalonMarker from "../../../components/CustomSalonMarker"

const containerStyle = {
  width: "100%",
  height: "100%",
}

// World view center and initial zoom
const WORLD_CENTER = { lat: 20, lng: 0 }
const WORLD_ZOOM = 2
const TARGET_ZOOM = 13

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
  const [currentZoom, setCurrentZoom] = useState(WORLD_ZOOM)
  const [currentMapCenter, setCurrentMapCenter] = useState(WORLD_CENTER)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const mapRef = useRef(null)
  const animationTimeoutRef = useRef(null)
  const zoomIntervalRef = useRef(null)

  // Target center from props
  const targetCenter = useMemo(
    () => ({ lat: center[0], lng: center[1] }),
    [center]
  )

  // Smooth animation function
  const animateToLocation = (targetLat, targetLng, targetZoom) => {
    if (!mapRef.current || isAnimating) return

    setIsAnimating(true)
    const map = mapRef.current
    const targetPosition = { lat: targetLat, lng: targetLng }

    // Update center state immediately to prevent conflicts
    setCurrentMapCenter(targetPosition)

    // Animate center first, then zoom
    map.panTo(targetPosition)
    
    // Start zoom animation after a brief delay
    setTimeout(() => {
      const startZoom = map.getZoom()
      const zoomDiff = targetZoom - startZoom
      const steps = 20
      const zoomIncrement = zoomDiff / steps
      let currentStep = 0

      zoomIntervalRef.current = setInterval(() => {
        if (!mapRef.current) {
          if (zoomIntervalRef.current) {
            clearInterval(zoomIntervalRef.current)
            zoomIntervalRef.current = null
          }
          return
        }

        if (currentStep >= steps) {
          if (zoomIntervalRef.current) {
            clearInterval(zoomIntervalRef.current)
            zoomIntervalRef.current = null
          }
          mapRef.current.setZoom(targetZoom)
          setCurrentZoom(targetZoom)
          setIsAnimating(false)
          setHasAnimated(true)
          return
        }

        const newZoom = startZoom + (zoomIncrement * currentStep)
        mapRef.current.setZoom(newZoom)
        currentStep++
      }, 50) // 50ms intervals for smooth animation
    }, 800) // Wait for pan to complete
  }

  // Trigger initial animation when userLocation is available
  useEffect(() => {
    if (userLocation && !hasAnimated && !isAnimating && mapRef.current) {
      // Small delay to ensure map is fully loaded
      animationTimeoutRef.current = setTimeout(() => {
        animateToLocation(userLocation.lat, userLocation.lng, TARGET_ZOOM)
      }, 1000)
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [userLocation, hasAnimated, isAnimating])

  // Update zoom when prop changes (after initial animation)
  useEffect(() => {
    if (hasAnimated && !isAnimating) {
      setCurrentZoom(zoom)
    }
  }, [zoom, hasAnimated, isAnimating])

  // Update center when prop changes (after initial animation)
  useEffect(() => {
    if (hasAnimated && !isAnimating && mapRef.current) {
      const shouldUpdate = 
        Math.abs(targetCenter.lat - currentMapCenter.lat) > 0.001 ||
        Math.abs(targetCenter.lng - currentMapCenter.lng) > 0.001
      
      if (shouldUpdate) {
        setCurrentMapCenter(targetCenter)
        mapRef.current.panTo(targetCenter)
      }
    }
  }, [targetCenter, hasAnimated, isAnimating, currentMapCenter])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current)
      }
    }
  }, [])

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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    )

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentMapCenter}
        zoom={currentZoom}
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: !isAnimating, // Disable controls during animation
          scaleControl: false,
          rotateControl: false,
          keyboardShortcuts: !isAnimating,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: isAnimating ? "none" : "auto" // Disable gestures during animation
        }}
        onLoad={(map) => {
          mapRef.current = map
          // Ensure map starts at world view
          map.setCenter(WORLD_CENTER)
          map.setZoom(WORLD_ZOOM)
        }}
        onZoomChanged={() => {
          if (mapRef.current && !isAnimating) {
            setCurrentZoom(mapRef.current.getZoom())
          }
        }}
      >
        {/* Custom Salon Markers - Show after animation completes or if no user location */}
        {(hasAnimated || !userLocation) && filteredSalons.map((salon) => {
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

        {/* User Location Marker - Show after animation completes */}
        {userLocation && hasAnimated && (
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

        {/* Loading indicator during animation */}
        {isAnimating && (
          <OverlayView
            position={currentMapCenter}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            getPixelPositionOffset={() => ({ x: -50, y: -50 })}
          >
            <div className=" rounded-lg shadow-lg px-16 py-2 flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Finding your location...</span>
            </div>
          </OverlayView>
        )}


      </GoogleMap>
    </div>
  )
}
