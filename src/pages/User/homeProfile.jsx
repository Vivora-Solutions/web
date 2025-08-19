// import { useEffect, useState } from "react"
// import { Search, Menu } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng"
// import Header from "./components/Header"
// import HeroSection from "./components/HeroSection"
// import MapSection from "./components/MapSection"
// import SalonList from "./components/SalonList"
// import ReviewSection from "./components/ReviewSection"
// import Footer from "./components/Footer"
// import CTASection from "./components/CTASection"
// import { PublicAPI } from "../../utils/api"

// const HomePage = () => {
//   const [salons, setSalons] = useState([])
//   const [filteredSalons, setFilteredSalons] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedSalon, setSelectedSalon] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [center, setCenter] = useState([7.8731, 80.7718])
//   const [zoom, setZoom] = useState(7)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchSalons = async () => {
//       try {
//         setIsLoading(true)
//         const res = await PublicAPI.get("/salons")
//         const data = res.data
//         const parsed = data
//           .filter((s) => s.location)
//           .map((s) => ({
//             ...s,
//             coordinates: parseWKBHexToLatLng(s.location),
//           }))
//         setSalons(parsed)
//         setFilteredSalons(parsed)
//       } catch (err) {
//         console.error("Failed to fetch salons:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchSalons()
//   }, [])

//   useEffect(() => {
//     const term = searchTerm.toLowerCase()
//     const filtered = salons.filter(
//       (salon) =>
//         salon.salon_name.toLowerCase().includes(term) ||
//         salon.salon_address.toLowerCase().includes(term),
//     )
//     setFilteredSalons(filtered)
//   }, [searchTerm, salons])

//   const handleSalonClick = (salonId) => {
//     navigate(`/appointment/${salonId}`)
//   }

//   const handleSalonHover = (salon) => {
//     setSelectedSalon(salon)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
//     <Header />

//     {/* Desktop search in HeroSection */}
//     <div className="hidden lg:block">
//       <HeroSection
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         salonCount={filteredSalons.length}
//       />
//     </div>

//     {/* Mobile half-screen map */}
//     <div className="lg:hidden relative w-full h-[65vh]">
//       <MapSection
//         center={center}
//         zoom={zoom}
//         filteredSalons={filteredSalons}
//         onSalonClick={handleSalonClick}
//         className="w-full h-full"
//       />

//       {/* Search bar overlay */}
//       <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12">
//       <div className="flex items-center justify-between bg-white rounded-full shadow-md px-4 py-2">
        
//         {/* Left search icon */}
//         <Search className="w-5 h-5 text-gray-500 mr-2" />
        
//         {/* Input field */}
//         <input
//           type="text"
//           placeholder="Search salons..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 bg-transparent text-sm focus:outline-none"
//         />
//       </div>
//     </div>

//     </div>


//   {/* Desktop content */}
//   <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
//     {/* SalonList: order 2 on mobile, order 1 on desktop */}
//     <div className="order-2 lg:order-1 mb-8">
//       <SalonList
//         filteredSalons={filteredSalons}
//         isLoading={isLoading}
//         onSalonClick={handleSalonClick}
//         onSalonHover={handleSalonHover}
//       />
//     </div>

//     {/* MapSection only for desktop */}
//     <div className="hidden lg:block order-1 lg:order-2 relative">
//       <MapSection
//         center={center}
//         zoom={zoom}
//         filteredSalons={filteredSalons}
//         onSalonClick={handleSalonClick}
//         className="w-full h-[600px]"
//       />
//     </div>
//   </div>

//   <ReviewSection />
//   <CTASection />
//   <Footer />
// </div>
//   )
// }

// export default HomePage


import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import MapSection from "./components/MapSection"
import SalonList from "./components/SalonList"
import ReviewSection from "./components/ReviewSection"
import Footer from "./components/Footer"
import CTASection from "./components/CTASection"
import { PublicAPI } from "../../utils/api"

const HomePage = () => {
  const [salons, setSalons] = useState([])
  const [filteredSalons, setFilteredSalons] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [center, setCenter] = useState([7.8731, 80.7718]) // default Sri Lanka
  const [zoom, setZoom] = useState(7)
  const [userLocation, setUserLocation] = useState(null)
  const navigate = useNavigate()

  // ✅ Get salons
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setIsLoading(true)
        const res = await PublicAPI.get("/salons")
        const data = res.data
        const parsed = data
          .filter((s) => s.location)
          .map((s) => ({
            ...s,
            coordinates: parseWKBHexToLatLng(s.location),
          }))
        setSalons(parsed)
        setFilteredSalons(parsed)
      } catch (err) {
        console.error("Failed to fetch salons:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSalons()
  }, [])

  // ✅ Get current location & update center
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setCenter([latitude, longitude])
          setZoom(13)
        },
        (err) => {
          console.warn("Geolocation error:", err)
        },
        { enableHighAccuracy: true }
      )
    }
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = salons.filter(
      (salon) =>
        salon.salon_name.toLowerCase().includes(term) ||
        salon.salon_address.toLowerCase().includes(term),
    )
    setFilteredSalons(filtered)
  }, [searchTerm, salons])

  const handleSalonClick = (salonId) => {
    navigate(`/appointment/${salonId}`)
  }

  const handleSalonHover = (salon) => {
    setSelectedSalon(salon)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />

      {/* Desktop search in HeroSection */}
      <div className="hidden lg:block">
        <HeroSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          salonCount={filteredSalons.length}
        />
      </div>

      {/* Mobile half-screen map */}
      <div className="lg:hidden relative w-full h-[65vh]">
        <MapSection
          center={center}
          zoom={zoom}
          filteredSalons={filteredSalons}
          onSalonClick={handleSalonClick}
          userLocation={userLocation}
          className="w-full h-full"
        />

        {/* Search bar overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12">
          <div className="flex items-center justify-between bg-white rounded-full shadow-md px-4 py-2">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search salons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Desktop content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
        <div className="order-2 lg:order-1 mb-8">
          <SalonList
            filteredSalons={filteredSalons}
            isLoading={isLoading}
            onSalonClick={handleSalonClick}
            onSalonHover={handleSalonHover}
          />
        </div>

        <div className="hidden lg:block order-1 lg:order-2 relative">
          <MapSection
            center={center}
            zoom={zoom}
            filteredSalons={filteredSalons}
            onSalonClick={handleSalonClick}
            userLocation={userLocation}
            className="w-full h-[600px]"
          />
        </div>
      </div>

      <ReviewSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default HomePage
