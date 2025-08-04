"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const MapSection = ({ center, zoom, filteredSalons, onSalonClick, className }) => {
  return (
    <div className={className}>
      

      <div className="absolute top-6 right-6 z-10">
        <button className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-100 hover:bg-white transition-all duration-200 group">
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-l-3xl lg:rounded-r-none"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {filteredSalons.map((salon) => (
          <Marker key={salon.salon_id} position={[salon.coordinates.lat, salon.coordinates.lng]} icon={defaultIcon}>
            <Popup className="custom-popup">
              <div
                onClick={() => onSalonClick(salon.salon_id)}
                className="cursor-pointer bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-lg min-w-64 transform hover:scale-105 transition-transform"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={salon.salon_logo_link || "/placeholder.svg"}
                    alt="Salon Logo"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">{salon.salon_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-yellow-300 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < salon.average_rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <span className="text-white/80 text-sm">({salon.average_rating || 0})</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {salon.salon_address}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 text-sm font-medium">Open Now</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/90 hover:text-white transition-colors">
                    <span className="text-sm font-medium">Book Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
        }
      `}</style>
    </div>
  )
}

export default MapSection
