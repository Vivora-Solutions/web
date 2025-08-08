import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useBookingStore from "../../store/bookingStore"
import { ProtectedAPI } from "../../utils/api"
import Header from "./components/Header"
import { CheckCircle, Calendar, Clock, Tag } from "lucide-react" // Import Lucide icons

const BookingConfirm = () => {
  const navigate = useNavigate()
  const { bookingDetails, restoreBookingDetails, clearBookingDetails, hydrated } = useBookingStore()
  const [salonDetails, setSalonDetails] = useState(null)
  const [services, setServices] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Restore from localStorage on mount
  useEffect(() => {
    restoreBookingDetails()
  }, [])

  useEffect(() => {
    if (!hydrated) return

    if (
      !confirmed &&
      (!bookingDetails ||
        !bookingDetails.serviceIds?.length ||
        !bookingDetails.stylistId ||
        !bookingDetails.date ||
        !bookingDetails.timeSlot)
    ) {
      navigate("/")
      return
    }

    const fetchSalonAndServices = async () => {
      try {
        const serviceDetailsPromises = bookingDetails.serviceIds.map((id) =>
          ProtectedAPI.get(`/salons/service-details?id=${id}`),
        )
        const responses = await Promise.all(serviceDetailsPromises)
        const serviceData = responses.map((res) => res.data)
        setServices(serviceData)
        if (serviceData.length > 0) {
          setSalonDetails(serviceData[0].salon)
        }
      } catch (error) {
        console.error("Failed to load service details:", error)
      }
    }

    fetchSalonAndServices()
  }, [hydrated, bookingDetails, navigate, confirmed]) // Added 'confirmed' to dependency array

  const handleConfirmBooking = async () => {
    if (!bookingDetails) {
      alert("No booking details found.")
      return
    }

    setLoading(true)
    const { stylistId, serviceIds, timeSlot } = bookingDetails
    const payload = {
      stylist_id: stylistId,
      service_ids: serviceIds,
      booking_start_datetime: timeSlot.start,
      notes: "Fasterrrrrrrrrrrr",
    }

    try {
      const response = await ProtectedAPI.post("/bookings", payload)
      if (response.data.booking_id) {
        clearBookingDetails()
        setConfirmed(true)
        setTimeout(() => {
          navigate("/my-bookings")
        }, 2500) // wait 2.5 seconds before redirecting
      } else {
        alert("Booking failed. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      // Use finally to ensure loading is set to false
      setLoading(false)
    }
  }

  if (!bookingDetails || !salonDetails) return null

  const { date, timeSlot } = bookingDetails

  const formatTime = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const total = services.reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-red-50 flex flex-col">
      <Header />
     <div className="flex-1 flex flex-col items-center justify-center py-2 px-2 sm:py-4 sm:px-4 md:py-10 md:px-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col items-center space-y-6 transform transition-all duration-300 hover:scale-[1.01]">
          {!confirmed ? (
            <>
<div className="flex flex-col items-center text-center w-full px-4">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2">
    Confirm Your Booking
  </h1>
  <p className="text-gray-600 text-base sm:text-lg hidden sm:block">
    Please review your appointment details before confirming.
  </p>
</div>

              {/* New container for side-by-side layout */}
<div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
  {/* Left Section: Salon Details - Compact on mobile */}
  <div className="flex flex-col items-center text-center md:w-1/2 space-y-2 md:space-y-4 p-2 md:p-4 border border-gray-100 rounded-lg md:rounded-xl shadow-sm">
    <img
      src={salonDetails.salon_logo_link || "/placeholder.svg?height=96&width=96&query=salon%20logo"}
      alt="Salon Logo"
      className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-200 shadow-md ring-2 md:ring-4 ring-gray-500 ring-opacity-60"
    />
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">{salonDetails.salon_name}</h2>
      <p className="text-gray-600 text-sm md:text-md">{salonDetails.salon_location || "Colombo"}</p>
    </div>
  </div>

  {/* Right Section: Booking Details - Compact on mobile */}
  <div className="w-full md:w-1/2 border border-gray-100 rounded-lg md:rounded-xl shadow-sm p-2 md:p-4 space-y-2 md:space-y-4 text-sm md:text-base text-gray-700">
    <div className="flex justify-between items-center">
      <span className="font-medium flex items-center gap-1 md:gap-2">
        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-black" /> Date
      </span>
      <span>{formatDate(date)}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-medium flex items-center gap-1 md:gap-2">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-black" /> Time Slot
      </span>
      <span>
        {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="font-medium flex items-center gap-1 md:gap-2">
        <Tag className="w-4 h-4 md:w-5 md:h-5 text-black" /> Duration
      </span>
      <span>{services[0]?.duration_minutes || 45} min</span>
    </div>
    <div className="flex flex-col gap-1 md:gap-2 pt-2 md:pt-4 border-t border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-0 md:mb-1 text-sm md:text-base">Services:</h3>
      {services.map((service, idx) => (
        <div key={idx} className="flex justify-between text-xs md:text-sm text-gray-600">
          <span>{service.service_name}</span>
          <span>Rs {service.price}</span>
        </div>
      ))}
    </div>
    <div className="flex justify-between text-lg md:text-xl font-extrabold pt-2 md:pt-4 border-t border-gray-200 mt-2 md:mt-4 text-gray-900">
      <span>Total</span>
      <span>Rs {total}</span>
    </div>
  </div>
</div>

              {/* Buttons remain below the side-by-side sections */}
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3 text-base bg-gradient-to-r from-gray-600 to-gray-900 text-white rounded-xl shadow-lg hover:from-gray-900 hover:to-blacktransition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-base bg-gray-50 text-gray-600 border border-gray-200 rounded-xl shadow hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-500 rounded-full p-4 mb-4 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-600 text-lg">Your appointment has been successfully booked.</p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                Back to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingConfirm
