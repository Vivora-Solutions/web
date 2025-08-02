"use client"

import { useEffect, useState } from "react"
import "./SchedulingInterface.css"
import API from "../../../../utils/api"
import { PersonStandingIcon, Phone } from "lucide-react"

const SchedulingInterface = () => {
  const [selectedStylists, setSelectedStylists] = useState([]) // Changed to array
  const [selectedDays, setSelectedDays] = useState("3 Days")
  const [showAddSlotPanel, setShowAddSlotPanel] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSithumMethod, setIsSithumMethod] = useState(false)
  const [stylists, setStylists] = useState([])
  const [availabilityCheckUrl, setAvailabilityCheckUrl] = useState("/salons/available-time-slots")
  const [avilabilityCheck, setAvilabilityCheck] = useState(false)
  const [services, setServices] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [newSlot, setNewSlot] = useState({
    id: "",
    name: "",
    services: [],
    stylist: "Any",
    startTime: "",
    endTime: "",
  })
  const [showAppointmentPanel, setShowAppointmentPanel] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  // Updated stylists with unique colors
  const defaultColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"]

  // Time slots from 5 AM to 7 PM with 1-hour intervals
  const timeSlots = [
    "1.00 am",
    "2:00 am",
    "3:00 am",
    "4:00 am",
    "5:00 am",
    "6:00 am",
    "7:00 am",
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
    "6:00 pm",
    "7:00 pm",
    "8:00 pm",
    "9:00 pm",
    "10:00 pm",
    "11:00 pm",
    "12:00 am",
  ]

  const dayFilters = ["1 Day", "2 Days", "3 Days", "5 Days"]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [bookingsResponse, stylistsResponse, servicesResponse] =
          await Promise.all([
            API.get("/salon-admin/booking"),
            API.get("/salon-admin/stylists"),
            API.get("/salon-admin/services"),
          ]);

        // Set bookings
        setSchedules(bookingsResponse.data);
        console.log("Schedules fetched:", bookingsResponse.data);

        // Set stylists with colors
        const stylistsWithColors = stylistsResponse.data.map(
          (stylist, index) => ({
            id: stylist.stylist_id,
            name: stylist.stylist_name,
            color: defaultColors[index % defaultColors.length],
            avatar: "👤",
            bio: stylist.bio,
            contact: stylist.contact,
            profile_pic: stylist.profile_pic,
            is_active: stylist.is_active,
          })
        );

        setStylists(stylistsWithColors);
        console.log("Stylists fetched:", stylistsWithColors);

        // Set services
        const servicesData = servicesResponse.data.map((service) => ({
          id: service.service_id,
          name: service.service_name,
          price: service.price,
          duration: service.duration_minutes,
          description: service.description,
        }));

        setServices(servicesData);
        console.log("Services fetched:", servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);

        // Fallback: Extract data from bookings if individual endpoints fail
        try {
          const response = await API.get("/salon-admin/booking");
          setSchedules(response.data);

          // Extract unique stylists from the booking data as fallback
          const uniqueStylists = [];
          const stylistIds = new Set();

          response.data.forEach((booking) => {
            if (
              booking.stylist &&
              !stylistIds.has(booking.stylist.stylist_id)
            ) {
              stylistIds.add(booking.stylist.stylist_id);
              const colorIndex = uniqueStylists.length % defaultColors.length;
              uniqueStylists.push({
                id: booking.stylist.stylist_id,
                name: booking.stylist.stylist_name,
                color: defaultColors[colorIndex],
                avatar: "👤",
              });
            }
          });

          setStylists(uniqueStylists);

          // Extract unique services from the booking data as fallback
          const uniqueServices = [];
          const serviceIds = new Set();

          response.data.forEach((booking) => {
            booking.booking_services.forEach((service) => {
              if (!serviceIds.has(service.service_id)) {
                serviceIds.add(service.service_id);
                uniqueServices.push({
                  id: service.service_id,
                  name: `Service ${service.service_id.substring(0, 8)}`,
                  price: service.service_price_at_booking,
                  duration: service.service_duration_at_booking,
                });
              }
            });
          });

          setServices(uniqueServices);
        } catch (fallbackError) {
          console.error("Error in fallback data fetch:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const generateDates = (days) => {
    const dates = []
    const today = new Date()
    today.setDate(today.getDate() - 5) // Start from tomorrow
    for (let i = 0; i < Number.parseInt(days.split(" ")[0]); i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = date.getDate()
      const monthName = date.toLocaleString("default", { month: "long" })
      dates.push(`${dayName}${getDaySuffix(dayName)} ${monthName}`)
    }
    return dates
  }

  const parseTimeToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.toLowerCase().split(" ")
    let [hours, minutes] = time.split(":").map(Number)
    if (modifier === "pm" && hours !== 12) {
      hours += 12
    } else if (modifier === "am" && hours === 12) {
      hours = 0
    }
    return hours * 60 + minutes
  }

  const calculateSlotPosition = (startTime, endTime) => {
    const startMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(endTime)
    const duration = endMinutes - startMinutes

    const slotStartMinutes = parseTimeToMinutes("5:00 am")
    const relativeStart = startMinutes - slotStartMinutes

    const hourHeight = 64 // pixels per hour (matching CSS)
    const top = (relativeStart / 60) * hourHeight
    const height = (duration / 60) * hourHeight

    return { top, height }
  }

  const getDynamicAppointments = (dates) => {
    const dynamicAppointments = {}
    dates.forEach((date) => {
      dynamicAppointments[date] = []
    })

    if (schedules && schedules.length > 0) {
      schedules.forEach((booking) => {
        try {
          const bookingStartDate = new Date(booking.booking_start_datetime)
          const bookingEndDate = new Date(booking.booking_end_datetime)

          const localBookingStartDate = new Date(
            bookingStartDate.getTime() - bookingStartDate.getTimezoneOffset() * 60000,
          )
          const localBookingEndDate = new Date(bookingEndDate.getTime() - bookingEndDate.getTimezoneOffset() * 60000)

          const startTime = localBookingStartDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            timeZone: "-05:30",
          })

          const endTime = localBookingEndDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
            timeZone: "-05:30",
          })

          const dayName = localBookingStartDate.getDate()
          const monthName = localBookingStartDate.toLocaleString("default", { month: "long" })
          const formattedDate = `${dayName}${getDaySuffix(dayName)} ${monthName}`
          const bookingDate = `${localBookingStartDate.getFullYear()}-${String(localBookingStartDate.getMonth() + 1).padStart(2, "0")}-${String(localBookingStartDate.getDate()).padStart(2, "0")}`

          if (dates.includes(formattedDate)) {
            console.log("Found matching date:", formattedDate);
            const serviceNames = booking.booking_services
              .map((bookingService) => {
                const serviceDetail = services.find((s) => s.id === bookingService.service_id)
                return serviceDetail?.name || `Service ${bookingService.service_id.substring(0, 8)}`
              })
              .join(", ")

            const position = calculateSlotPosition(startTime, endTime)
            var name = "";
            var mobile = "";
            const customerType = booking.user_id ? "Online Customer" : "Non-Online Customer";
            if (customerType === "Online Customer") {
              name = booking.customer?.first_name + " " + booking.customer?.last_name || "N/A";
              mobile = booking.customer?.contact_number || "N/A";
            } else {
              name = booking.non_online_customer?.non_online_customer_name || "N/A";
              mobile = booking.non_online_customer?.non_online_customer_mobile_number || "N/A";
            }
            const appointmentData = {
              booking_id: booking.booking_id,
              startTime,
              endTime,
              position,
              stylistId: booking.stylist?.stylist_id || "unknown",
              stylistName: booking.stylist?.stylist_name || "Unknown Stylist",
              service: serviceNames,
              services: booking.booking_services,
              phone: mobile,
              clientType: customerType,
              clientName: name,
              workstation: booking.workstation?.workstation_name || "N/A",
              salon: booking.salon?.salon_name || "N/A",
              date: formattedDate,
              notes: booking.notes || "",
              bookingDate: bookingDate,
            }

            dynamicAppointments[formattedDate].push(appointmentData)
          }
        } catch (error) {
          console.error("Error processing booking:", booking, error)
        }
      })
    }

    return dynamicAppointments
  }

  const currentDates = generateDates(selectedDays)
  const allAppointments = getDynamicAppointments(currentDates)

  // Filter appointments based on selected stylists
  const filteredAppointments = {}
  currentDates.forEach((date) => {
    filteredAppointments[date] =
      allAppointments[date]?.filter((appointment) => {
        return selectedStylists.includes(appointment.stylistId)
      }) || []
  })

  // Get selected stylists data
  const selectedStylistsData = stylists.filter((stylist) => selectedStylists.includes(stylist.id))

  const getStylistById = (id) => {
    const fetchedStylist = stylists.find((s) => s.id === id)
    if (fetchedStylist) return fetchedStylist
    const colorIndex = typeof id === "string" ? id.length % defaultColors.length : id % defaultColors.length
    return {
      id: id,
      name: typeof id === "string" ? `Stylist ${id.substring(0, 8)}` : `Stylist ${id}`,
      color: defaultColors[colorIndex],
      avatar: "👤",
    }
  }

  const handleServiceToggle = (serviceId) => {
    setNewSlot((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }))
  }

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentPanel(true)
  }

  const handleStylistToggle = (stylistId) => {
    setSelectedStylists((prev) => {
      if (prev.includes(stylistId)) {
        return prev.filter((id) => id !== stylistId)
      } else {
        return [...prev, stylistId]
      }
    })
  }

  const handleSelectAllStylists = () => {
    const allStylistIds = stylists.filter((s) => s.is_active !== false).map((s) => s.id)
    if (selectedStylists.length === allStylistIds.length) {
      setSelectedStylists([]) // Deselect all
    } else {
      setSelectedStylists(allStylistIds) // Select all
    }
  }

  const getStylistColumnIndex = (stylistId) => {
    return selectedStylists.indexOf(stylistId)
  }

  const handleEditBooking = (appointment) => {
    //open add slot panel with pre-filled data
    console.log("Editing booking:", appointment);
    setNewSlot({
      id: appointment.booking_id || "",
      name: appointment.clientName || "",
      date: appointment.bookingDate || "",
      mobile: appointment.phone || "",
      services: appointment.services?.map((s) => s.service_id) || [],
      stylist: appointment.stylistId || "",
      startTime: appointment.startTime || "",
      endTime: appointment.endTime || "",
    });
    setShowAppointmentPanel(false);
    setShowAddSlotPanel(true);
    console.log("Editing booking:", newSlot);

  }
  const handleCancelBooking = async (appointment) => {
    try {
      await API.delete(`/salon-admin/booking/${appointment.booking_id}`);
      // reload appointments
      const updatedSchedules = schedules.filter((s) => s.booking_id !== appointment.booking_id);
      setSchedules(updatedSchedules);
      setShowAppointmentPanel(false);
      setSelectedAppointment(null);
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  }

  const checkAvailability = async () => {
    try {
      // Prepare payload for available time slots API
      // Convert date to yyyy-mm-dd format
      // let formattedDate = "";
      // if (newSlot.date) {
      //   const dateObj = new Date(newSlot.date);
      //   const year = dateObj.getFullYear();
      //   const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      //   const day = String(dateObj.getDate()).padStart(2, "0");
      //   formattedDate = `${year}-${month}-${day}`;
      // }
      const payload = {
        service_ids: newSlot.services,
        stylist_id: newSlot.stylist || null,
        salon_id: schedules[0]?.salon?.salon_id || null,
        date: newSlot.date || null,
      };
      const response = await API.post(availabilityCheckUrl, payload);
      setAvailableTimeSlots(response.data.data || []);
      setAvilabilityCheck(true);
      console.log("Available time slots:", response.data.data);
    } catch (error) {
      console.error("Error fetching available time slots:", error);
    }
  }

  const handleConfirmAppointment = async () => {
    const appointment = {
      stylist_id: newSlot.stylist,
      booking_start_datetime: newSlot.startTime,
      booking_end_datetime: newSlot.endTime,
    };
    console.log("Confirming appointment:", appointment);
    try {
      const response = await API.put(`/salon-admin/booking/${selectedAppointment?.booking_id}`, appointment);
      setAvailableTimeSlots([]);
      setAvilabilityCheck(false);
      setNewSlot({
        id: "",
        name: "",
        date: "",
        mobile: "",
        services: [],
        stylist: "",
        startTime: "",
        endTime: "",
      });
      setShowAddSlotPanel(false);
      setShowAppointmentPanel(false);
      setSelectedAppointment(null);
      alert("Appointment updated successfully.");
      // Reload schedules
      schedules.forEach((schedule) => {
        if (schedule.booking_id === selectedAppointment?.booking_id) {
          schedule.booking_start_datetime = newSlot.startTime;
          schedule.booking_end_datetime = newSlot.endTime;
        }
      });
    } catch (error) {
      console.error("Error fetching available time slots:", error);
    }
  }

  return (
    <div className="scheduling-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="filter-section">
          <h3>Staff Members</h3>
          <button
            className={`filter-btn all-btn ${selectedStylists.length === stylists.filter((s) => s.is_active !== false).length ? "active" : ""}`}
            onClick={handleSelectAllStylists}
          >
            <span className="filter-icon">👥</span>
            {selectedStylists.length === stylists.filter((s) => s.is_active !== false).length
              ? "Deselect All"
              : "Select All"}
          </button>

          <div className="stylists-list">
            {stylists
              .filter((stylist) => stylist.is_active !== false)
              .map((stylist) => (
                <div
                  key={stylist.id}
                  className={`stylist-item ${selectedStylists.includes(stylist.id) ? "active" : ""}`}
                  onClick={() => handleStylistToggle(stylist.id)}
                >
                  <div className="stylist-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedStylists.includes(stylist.id)}
                      onChange={() => handleStylistToggle(stylist.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="stylist-avatar" style={{ backgroundColor: stylist.color }}>
                    {stylist.avatar}
                  </div>
                  <span className="stylist-name">{stylist.name}</span>
                  <div className="active-indicator"></div>
                </div>
              ))}
          </div>
        </div>

        <div className="day-filters-section">
          <h3>View Period</h3>
          <div className="day-filters">
            {dayFilters.map((day) => (
              <button
                key={day}
                className={`day-filter-btn ${selectedDays === day ? "active" : ""}`}
                onClick={() => setSelectedDays(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {selectedStylists.length > 0 && (
          <div className="selected-stylists-info">
            <h4>
              Selected: {selectedStylists.length} stylist{selectedStylists.length !== 1 ? "s" : ""}
            </h4>
            <div className="selected-stylists-preview">
              {selectedStylistsData.map((stylist) => (
                <div key={stylist.id} className="selected-stylist-chip" style={{ backgroundColor: stylist.color }}>
                  {stylist.name.split(" ")[0]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-info">
            <h2>Schedule Management</h2>
            <p>Manage and edit available time slots</p>
          </div>
          <button className="add-slot-btn" onClick={() => {
            setIsSithumMethod(!isSithumMethod);
            isSithumMethod ? setAvailabilityCheckUrl("/salons/available-time-slots-sithum") : setAvailabilityCheckUrl("/salons/available-time-slots");
          }}>
            <span>+</span>
            {isSithumMethod ? "Using Sithum" : "Using Sahan"}
          </button>
          <button className="add-slot-btn" onClick={() => setShowAddSlotPanel(true)}>
            <span>+</span>
            Add Appointment
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : selectedStylists.length === 0 ? (
          <div className="no-selection-container">
            <div className="no-selection-message">
              <h3>No stylists selected</h3>
              <p>Please select one or more stylists to view their schedules</p>
            </div>
          </div>
        ) : (
          <div className="calendar-container">
            <div className="calendar-grid">
              {/* Time Column */}
              <div className="time-column">
                <div className="time-header">Time</div>
                {timeSlots.map((time, index) => (
                  <div key={index} className="time-slot">
                    {time}
                  </div>
                ))}
              </div>

              {/* Date Columns */}
              {currentDates.map((date) => (
                <div key={date} className="date-column">
                  <div className="date-header">
                    <div className="date-info">
                      <span className="date-day">{date.split(" ")[0]}</span>
                      <span className="date-month">{date.split(" ")[1]}</span>
                    </div>
                  </div>

                  {/* Stylist Sub-headers */}
                  <div className="stylist-headers">
                    {selectedStylistsData.map((stylist) => (
                      <div
                        key={stylist.id}
                        className="stylist-header"
                        style={{ backgroundColor: `${stylist.color}20`, borderTopColor: stylist.color }}
                      >
                        <div className="stylist-header-avatar" style={{ backgroundColor: stylist.color }}>
                          {stylist.avatar}
                        </div>
                        <span className="stylist-header-name">{stylist.name.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="appointments-container">
                    {/* Time slot grid */}
                    {timeSlots.map((time, timeIndex) => (
                      <div key={timeIndex} className="time-grid-row">
                        {selectedStylistsData.map((stylist) => (
                          <div
                            key={`${timeIndex}-${stylist.id}`}
                            className="time-grid-slot"
                            style={{ width: `${100 / selectedStylists.length}%` }}
                          />
                        ))}
                      </div>
                    ))}

                    {/* Appointments positioned absolutely */}
                    {filteredAppointments[date]?.map((appointment, aptIndex) => {
                      const stylist = getStylistById(appointment.stylistId)
                      const columnIndex = getStylistColumnIndex(appointment.stylistId)
                      const columnWidth = 100 / selectedStylists.length
                      const leftPosition = columnIndex * columnWidth

                      return (
                        <div
                          key={aptIndex}
                          className="appointment-block"
                          style={{
                            backgroundColor: stylist.color,
                            top: `${appointment.position.top + 256}px`, // +72 for headers height
                            height: `${Math.max(appointment.position.height, 32)}px`,
                            left: `${leftPosition}%`,
                            width: `${columnWidth - 1}%`, // -1% for spacing
                          }}
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <div className="appointment-content">
                            <div className="appointment-header">
                              <span className="appointment-stylist">{appointment.stylistName.split(" ")[0]}</span>
                              {appointment.clientType === "Non-Online Customer" && (
                                <PersonStandingIcon className="service-icon h-4" />
                              )}
                              {appointment.clientType === "Online Customer" && (
                                <Phone className="service-icon h-4" />
                              )}

                            </div>
                            <span className="appointment-time">
                              {appointment.startTime.split(" ")[0]} - {appointment.endTime.split(" ")[0]}
                            </span>
                            {/* <div className="appointment-service">{appointment.service}</div> */}
                            {/* <div className="appointment-client">{appointment.clientName}</div> */}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Slot Panel */}
      {showAddSlotPanel && (
        <>
          <div className="overlay" onClick={() => setShowAddSlotPanel(false)} />
          <div className="side-panel add-slot-panel">
            <div className="panel-header">
              <PersonStandingIcon className="panel-icon" />
              <h2>Add New Appointment</h2>
              <button className="close-btn" onClick={() => setShowAddSlotPanel(false)}>
                ×
              </button>
            </div>

            <div className="panel-content">
              <div className="form-group">
                <label htmlFor="client-name">Client Name</label>
                <input
                  id="client-name"
                  type="text"
                  placeholder="Enter client name"
                  value={newSlot.name}
                  readOnly={newSlot.name !== "" ? true : false}
                  onChange={(e) => setNewSlot((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="client-name">Client Mobile</label>
                <input
                  id="client-mobile"
                  type="text"
                  placeholder="Enter client mobile"
                  value={newSlot.mobile}
                  readOnly={newSlot.mobile !== "" ? true : false}
                  onChange={(e) => setNewSlot((prev) => ({ ...prev, mobile: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Services</label>
                {/* <input type="text" placeholder="Search services..." className="search-input" /> */}
                <div className="services-list">
                  {services.map((service) => (
                    <div key={service.id} className="service-item">
                      <div className="service-info">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          readOnly={newSlot.name !== "" ? true : false}
                          checked={newSlot.services.includes(service.id)}
                          onChange={() => {
                            if (newSlot.name === "") handleServiceToggle(service.id)
                          }}
                        />
                        <label htmlFor={`service-${service.id}`}>
                          <span className="service-name">{service.name}</span>
                          <span className="service-duration">{service.duration} min</span>
                        </label>
                      </div>
                      <span className="service-price">₹{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Select Stylist</label>
                <div className="stylist-selection">
                  {/* <button
                    className={`stylist-option ${newSlot.stylist === "Any" ? "selected" : ""}`}
                    defaultValue={(stylists.find((s) => s.id === newSlot.stylist)?.name) || "Any"}
                    onClick={() => {
                      setNewSlot((prev) => ({ ...prev, stylist: "Any" }))
                    }}
                  >
                    Any Available
                  </button> */}
                  {stylists.map((stylist) => (
                    <button
                      key={stylist.id}
                      className={`stylist-option ${newSlot.stylist === stylist.id ? "selected" : ""}`}
                      onClick={() => {
                        setNewSlot((prev) => ({ ...prev, stylist: stylist.id }))
                      }}
                    >
                      <div className="stylist-color" style={{ backgroundColor: stylist.color }}></div>
                      {stylist.name}
                    </button>
                  ))}
                </div>
              </div>
              {/*Section to select the date*/}
              <div className="form-group">
                <label htmlFor="appointment-date">Select Date</label>
                <input
                  id="appointment-date"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              {!avilabilityCheck && (
                <button className="confirm-btn" onClick={checkAvailability}>
                  <span>✓</span>
                  Check Availability
                </button>
              )}
              {avilabilityCheck && (
                //list available time slots
                <div className="form-group">
                  <label htmlFor="appointment-time">Select Time Slot</label>
                  <select
                    id="appointment-time"

                    onChange={(e) => setNewSlot((prev) => ({ ...prev, startTime: e.target.value.split("|")[0].trim(), endTime: e.target.value.split("|")[1].trim() }))}
                  >
                    <option value="">Select a time slot</option>
                    {availableTimeSlots.map((slot, idx) => {
                      const start = new Date(slot.start);
                      const end = new Date(slot.end);
                      const formatTime = (date) =>
                        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
                      return (
                        <option key={idx} value={slot.start + "|" + slot.end}>
                          {formatTime(start)} - {formatTime(end)}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              {avilabilityCheck && (
                <button className="confirm-btn" onClick={handleConfirmAppointment}>
                  <span>✓</span>
                  Confirm Appointment
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Appointment Details Panel */}
      {showAppointmentPanel && selectedAppointment && (
        <>
          <div className="overlay" onClick={() => setShowAppointmentPanel(false)} />
          <div className="side-panel appointment-details-panel">
            <div className="panel-header">
              <div className="appointment-header-info">
                <div
                  className="stylist-avatar-large"
                  style={{ backgroundColor: getStylistById(selectedAppointment.stylistId)?.color }}
                >
                  👤
                </div>
                <div className="appointment-meta">
                  <h2>{selectedAppointment.stylistName}</h2>
                  <p>{selectedAppointment.date}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowAppointmentPanel(false)}>
                ×
              </button>
            </div>

            <div className="panel-content">
              <div className="form-group">
                <label>Client Type</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={selectedAppointment.clientType} readOnly />
                  {selectedAppointment.clientType && selectedAppointment.clientType !== "Online Customer" && (
                    <PersonStandingIcon className="service-icon" />
                  )}
                  {selectedAppointment.clientType && selectedAppointment.clientType === "Online Customer" && (
                    <Phone className="service-icon" />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Services</label>
                <div className="services-readonly">
                  {selectedAppointment.services?.map((service, index) => {
                    const serviceDetail = services.find((s) => s.id === service.service_id)
                    return (
                      <div key={index} className="service-readonly-item">
                        <div className="service-info">
                          <span className="service-name">
                            {serviceDetail?.name || `Service ${service.service_id.substring(0, 8)}`}
                          </span>
                          <span className="service-duration">{service.service_duration_at_booking} min</span>
                        </div>
                        <span className="service-price">₹{service.service_price_at_booking}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>Time Slot</label>
                <input
                  type="text"
                  value={`${selectedAppointment.startTime} - ${selectedAppointment.endTime}`}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Client Name</label>
                <input type="text" value={selectedAppointment.clientName} readOnly />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={selectedAppointment.phone} readOnly />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={selectedAppointment.notes} readOnly />
              </div>

              <div className="action-buttons">
                <button className="edit-btn" onClick={() => handleEditBooking(selectedAppointment)}>
                  <span>✏️</span>
                  Reschedule Booking
                </button>
                <button className="cancel-btn" onClick={() => handleCancelBooking(selectedAppointment)}>
                  <span>🗑️</span>
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SchedulingInterface
