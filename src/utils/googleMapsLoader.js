import { useJsApiLoader } from "@react-google-maps/api";

// Libraries needed for Google Maps
const LIBRARIES = ["marker"];

// Custom hook that ensures proper Google Maps API loading
export const useGoogleMapsLoader = () => {
  // Always call the hook - this ensures hooks are called in the same order
  const loaderResult = useJsApiLoader({
    id: "google-map-script-singleton",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    mapIds: [import.meta.env.VITE_GOOGLE_MAP_ID || ""],
    preventGoogleFontsLoading: true,
  });
  
  return loaderResult;
};
