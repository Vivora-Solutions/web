import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { parseWKBHexToLatLng } from "../../../utils/wkbToLatLng";
import { useGoogleMapsLoader } from "../../../utils/googleMapsLoader";

const SalonVerifyModal = ({ salon, onClose, onAction }) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();
  
  if (!salon) return null;
  //console.log("Salon data in modal:", salon);

  let coords = null;
  try {
    if (salon.location && typeof salon.location === "string") {
      //console.log("Parsing salon location:", salon.location);
      coords = parseWKBHexToLatLng(salon.location);
    }
  } catch (e) {
    console.error("Failed to parse location:", e);
  }

  // Google Maps container style
  const containerStyle = {
    width: "100%",
    height: "100%",
  };


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-2 sm:px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Verify Salon</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          {/* Salon Info */}
          <div>
            <img
              src={salon.salon_logo_link}
              alt={salon.salon_name}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border mb-3 sm:mb-4"
            />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{salon.salon_name}</h3>
            <p className="text-sm text-gray-500">{salon.salon_type}</p>
            <p className="text-sm text-gray-600 mt-2">📍 {salon.salon_address}</p>
            <p className="text-sm text-gray-600 mt-1">
              {salon.salon_description || "No description available."}
            </p>
            <p className="text-sm text-gray-600 mt-2">📞 {salon.salon_contact_number}</p>
            <p className="text-sm text-gray-600">✉️ {salon.salon_email}</p>
          </div>

          {/* Map or Placeholder */}
          <div className="w-full">
            {loadError && (
              <div className="w-full h-48 sm:h-64 rounded-lg border bg-red-50 flex items-center justify-center">
                <p className="text-red-600">Error loading map</p>
              </div>
            )}
            {!isLoaded && !loadError && (
              <div className="w-full h-48 sm:h-64 rounded-lg border bg-gray-100 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
              </div>
            )}
            {isLoaded && coords ? (
              <div className="w-full h-48 sm:h-64 rounded-lg border overflow-hidden">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: coords.lat, lng: coords.lng }}
                  zoom={15}
                  options={{
                    mapId: import.meta.env.VITE_GOOGLE_MAP_ID || undefined,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    zoomControl: true,
                    gestureHandling: "auto",
                  }}
                >
                  <Marker
                    position={{ lat: coords.lat, lng: coords.lng }}
                  />
                  <InfoWindow
                    position={{ lat: coords.lat, lng: coords.lng }}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -30)
                    }}
                  >
                    <div className="p-2">
                      <h4 className="font-semibold text-sm">{salon.salon_name}</h4>
                      <p className="text-xs text-gray-600">{salon.salon_address}</p>
                    </div>
                  </InfoWindow>
                </GoogleMap>
              </div>
            ) : isLoaded && !coords ? (
              <img
                src="https://via.placeholder.com/400x300?text=No+Location"
                alt="No location available"
                className="w-full h-48 sm:h-64 object-cover rounded-lg border"
              />
            ) : null}
          </div>
        </div>

        {/* Owner Info */}
        <div className="px-4 sm:px-6 pb-4 text-sm text-gray-700">
          <p><strong>Owner:</strong> {salon.owner_name}</p>
          <p className="text-gray-800">📞 {salon.owner_phone}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={() => onAction("accept", salon.salon_id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full sm:w-auto"
          >
            Accept
          </button>
          <button
            onClick={() => onAction("decline", salon.salon_id)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition w-full sm:w-auto"
          >
            Decline
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonVerifyModal;
