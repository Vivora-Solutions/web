import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng"
import Header from "../../components/Header/Header"
import HeroSection from "./components/HeroSection"
import MapSection from "./components/MapSection"
import SalonList from "./components/SalonList"
import ReviewSection from "./components/ReviewSection"
import Footer from "./components/Footer"
import CTASection from "./components/CTASection"
import axios from "axios"


import { Search, MapPin, Star, Phone, Calendar, ChevronRight, Sparkles, Navigation } from "lucide-react"

const HomePage = () => {
  const [salons, setSalons] = useState([])
  const [filteredSalons, setFilteredSalons] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [center, setCenter] = useState([7.8731, 80.7718])
  const [zoom, setZoom] = useState(7)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get("http://localhost:3000/api/salons")
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

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = salons.filter(
      (salon) => salon.salon_name.toLowerCase().includes(term) || salon.salon_address.toLowerCase().includes(term),
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
      {/* <Header /> */}

      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} salonCount={filteredSalons.length} />


<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
  {/* SalonList: order 1 on desktop, order 2 on mobile */}
  <div className="order-2 lg:order-1 mb-8">
    <SalonList
      filteredSalons={filteredSalons}
      isLoading={isLoading}
      onSalonClick={handleSalonClick}
      onSalonHover={handleSalonHover}
    />
  </div>

  {/* MapSection: order 1 on mobile, order 2 on desktop */}
  <div className="order-1 lg:order-2">
<MapSection
  center={center}
  zoom={zoom}
  filteredSalons={filteredSalons}
  onSalonClick={handleSalonClick}
  className="w-full h-[300px] md:h-[600px]"
/>

  </div>
</div>


      

      <ReviewSection />
      <CTASection />
      <Footer />

      <style jsx>{`
        /* index.css or tailwind.css */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage
