"use client";

import { useEffect, useState } from "react";
import "./SchedulingInterface.css";
import API from "../../../../utils/api";

const SchedulingInterface = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedDays, setSelectedDays] = useState("3 Days");
  const [showAddSlotPanel, setShowAddSlotPanel] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [newSlot, setNewSlot] = useState({
    name: "",
    services: [],
    stylist: "Any",
    date: "",
    time: "",
  });

  const [showAppointmentPanel, setShowAppointmentPanel] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const generateDates = (days) => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= Number.parseInt(days.split(" ")[0]); i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.getDate();
      const monthName = date.toLocaleString("default", { month: "long" });
      dates.push(`${dayName}${getDaySuffix(dayName)} ${monthName}`);
    }

    return dates;
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Updated stylists with unique colors - now populated from API
  const defaultColors = [
    "#ffb3ba",
    "#baffc9",
    "#bae1ff",
    "#ffffba",
    "#ffdfba",
    "#e0bbff",
  ];

  // Time slots from 5 AM to 7 PM with 1-hour intervals
  const timeSlots = [
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
  ];

  const getDynamicAppointments = (dates) => {
    const dynamicAppointments = {};

    // Initialize all dates with empty arrays
    dates.forEach((date) => {
      dynamicAppointments[date] = [];
    });

    // Process fetched schedules data
    if (schedules && schedules.length > 0) {
      schedules.forEach((booking) => {
        const bookingDate = new Date(booking.booking_start_datetime);
        const bookingTime = bookingDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        // Format date to match our date format (e.g., "2nd August")
        const dayName = bookingDate.getDate();
        const monthName = bookingDate.toLocaleString("default", {
          month: "long",
        });
        const formattedDate = `${dayName}${getDaySuffix(dayName)} ${monthName}`;

        // Check if this date is in our current view
        if (dates.includes(formattedDate)) {
          // Get services list for this booking
          const serviceNames = booking.booking_services
            .map((bookingService) => {
              const serviceDetail = services.find(
                (s) => s.id === bookingService.service_id
              );
              return serviceDetail
                ? serviceDetail.name
                : `Service ${bookingService.service_id.substring(0, 8)}`;
            })
            .join(", ");

          const appointmentData = {
            booking_id: booking.booking_id,
            time: bookingTime,
            stylistId: booking.stylist?.stylist_id || "unknown",
            stylistName: booking.stylist?.stylist_name || "Unknown Stylist",
            service: serviceNames, // Now shows actual service names
            services: booking.booking_services,
            phone:
              booking.non_online_customer?.non_online_customer_mobile_number ||
              "N/A",
            clientName:
              booking.non_online_customer?.non_online_customer_name ||
              "Online Customer",
            workstation: booking.workstation?.workstation_name || "N/A",
            salon: booking.salon?.salon_name || "N/A",
          };

          dynamicAppointments[formattedDate].push(appointmentData);
        }
      });
    }

    return dynamicAppointments;
  };

  const currentDates = generateDates(selectedDays);
  const appointments = getDynamicAppointments(currentDates);

  // Regenerate appointments when schedules data changes
  useEffect(() => {
    if (schedules.length > 0) {
      console.log("Schedules updated, regenerating appointments...");
    }
  }, [schedules]);

  const dayFilters = ["1 Day", "2 Days", "3 Days", "5 Days"];
  const dates = currentDates.map((date) =>
    date.split(" ")[0].replace(/\D/g, "")
  );

  const getStylistById = (id) => {
    // First try to find in the fetched stylists list
    const fetchedStylist = stylists.find((s) => s.id === id);
    if (fetchedStylist) return fetchedStylist;

    // If not found in fetched list, create a dynamic one based on stylist name/id
    const colorIndex =
      typeof id === "string"
        ? id.length % defaultColors.length
        : id % defaultColors.length;

    return {
      id: id,
      name:
        typeof id === "string"
          ? `Stylist ${id.substring(0, 8)}`
          : `Stylist ${id}`,
      color: defaultColors[colorIndex],
      avatar: "👤",
    };
  };

  const getAppointmentsForTimeSlot = (date, time) => {
    return appointments[date]?.filter((apt) => apt.time === time) || [];
  };

  const handleServiceToggle = (serviceId) => {
    setNewSlot((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleAppointmentClick = (appointment, date, time) => {
    setSelectedAppointment({ ...appointment, date, time });
    setShowAppointmentPanel(true);
  };

  return (
    <div className="scheduling-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="salon-title">Example Saloon</div>

        {/* User Filters */}
        <div className="filter-section">
          <button
            className={`filter-btn ${selectedFilter === "All" ? "active" : ""}`}
            onClick={() => setSelectedFilter("All")}
          >
            All
          </button>

          <div className="user-filters">
            {stylists
              .filter((stylist) => stylist.is_active !== false)
              .map((stylist) => (
                <div key={stylist.id} className="user-filter">
                  <div
                    className="user-avatar"
                    style={{ backgroundColor: stylist.color }}
                  >
                    {stylist.avatar}
                  </div>
                  <span className="user-name">{stylist.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Day Filters */}
        <div className="day-filters">
          {dayFilters.map((day) => (
            <button
              key={day}
              className={`day-filter-btn ${
                selectedDays === day ? "active" : ""
              }`}
              onClick={() => setSelectedDays(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <span className="edit-text">edit available time slots</span>
          <button
            className="add-slot-btn"
            onClick={() => setShowAddSlotPanel(true)}
          >
            Add Slot
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div
            className="loading-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              fontSize: "16px",
              color: "#666",
            }}
          >
            Loading appointments...
          </div>
        ) : (
          <div className="calendar-grid">
            {/* Time Column */}
            <div className="time-column">
              <div className="time-header"></div>
              {timeSlots.map((time, index) => (
                <div key={index} className="time-slot">
                  {time}
                </div>
              ))}
            </div>

            {/* Date Columns */}
            {Object.keys(appointments).map((date) => (
              <div key={date} className="date-column">
                <div className="date-header">{date}</div>
                {timeSlots.map((time, timeIndex) => {
                  const slotAppointments = getAppointmentsForTimeSlot(
                    date,
                    time
                  );
                  return (
                    <div key={timeIndex} className="appointment-slot">
                      {slotAppointments.length > 0 && (
                        <div className="appointment-blocks">
                          {slotAppointments.map((appointment, aptIndex) => {
                            const stylist = getStylistById(
                              appointment.stylistId
                            );
                            const blockWidth = `${
                              100 / slotAppointments.length
                            }%`;
                            return (
                              <div
                                key={aptIndex}
                                className="appointment-block"
                                style={{
                                  backgroundColor: stylist.color,
                                  width: blockWidth,
                                  height: "100%",
                                }}
                                onClick={() =>
                                  handleAppointmentClick(
                                    appointment,
                                    date,
                                    time
                                  )
                                }
                              >
                                <div className="appointment-header">
                                  <span className="provider-name">
                                    {appointment.stylistName || stylist.name}
                                  </span>
                                  <span className="appointment-icon">✂️</span>
                                </div>
                                <div className="appointment-service">
                                  {appointment.service}
                                </div>
                                <div className="appointment-phone">
                                  {appointment.phone}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Panel */}
      <div className={`add-slot-panel ${showAddSlotPanel ? "open" : ""}`}>
        <div className="panel-header">
          <h2>Add Time Slot</h2>
          <button
            className="close-btn"
            onClick={() => setShowAddSlotPanel(false)}
          >
            ×
          </button>
        </div>

        <div className="panel-content">
          {/* Name Field */}
          <div className="form-group">
            <label>Name</label>
            <div className="name-input-container">
              <input
                type="text"
                placeholder="Kamal"
                value={newSlot.name}
                onChange={(e) =>
                  setNewSlot((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <div className="gender-icons">
                <span className="gender-icon">♂</span>
                <span className="gender-icon">♀</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="form-group">
            <label>Services</label>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Services.."
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="services-list">
              {services.map((service) => (
                <div key={service.id} className="service-item">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={newSlot.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                  <label htmlFor={`service-${service.id}`}>
                    {service.name}
                  </label>
                  <span className="service-price">Rs {service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stylist Selection */}
          <div className="form-group">
            <div className="stylist-selection">
              <button
                className={`stylist-btn ${
                  newSlot.stylist === "Any" ? "active" : ""
                }`}
                onClick={() =>
                  setNewSlot((prev) => ({ ...prev, stylist: "Any" }))
                }
              >
                Any
              </button>
              {stylists.map((stylist) => (
                <div key={stylist.id} className="stylist-option">
                  <div
                    className={`stylist-avatar ${
                      newSlot.stylist === stylist.name ? "selected" : ""
                    }`}
                    style={{ backgroundColor: stylist.color }}
                    onClick={() =>
                      setNewSlot((prev) => ({ ...prev, stylist: stylist.name }))
                    }
                  >
                    {stylist.avatar}
                  </div>
                  <span className="stylist-name">{stylist.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="form-group">
            <div className="date-selection">
              {dates.map((date, index) => (
                <button
                  key={index}
                  className={`date-btn ${
                    newSlot.date === date ? "active" : ""
                  }`}
                  onClick={() => setNewSlot((prev) => ({ ...prev, date }))}
                >
                  <span className="date-number">{date}</span>
                  <span className="date-month">July</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="form-group">
            <div className="time-selection">
              {["9:00 am", "10:00 am", "11:00 am", "2:00 pm"].map(
                (time, index) => (
                  <button
                    key={index}
                    className={`time-btn ${index === 0 ? "selected" : ""}`}
                    onClick={() => setNewSlot((prev) => ({ ...prev, time }))}
                  >
                    {time}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Confirm Button */}
          <button className="confirm-btn">Confirm</button>
        </div>
      </div>

      {/* Appointment Details Panel */}
      <div
        className={`appointment-details-panel ${
          showAppointmentPanel ? "open" : ""
        }`}
      >
        {selectedAppointment && (
          <>
            <div className="panel-header">
              <div className="appointment-info">
                <div className="stylist-info">
                  <div
                    className="stylist-avatar-large"
                    style={{
                      backgroundColor: getStylistById(
                        selectedAppointment.stylistId
                      )?.color,
                    }}
                  >
                    👤
                  </div>
                  <span className="stylist-name-large">
                    {selectedAppointment.stylistName ||
                      getStylistById(selectedAppointment.stylistId)?.name}
                  </span>
                </div>
                <div className="date-circle">
                  <span className="date-number">
                    {selectedAppointment.date.split(" ")[0]}
                  </span>
                  <span className="date-month">
                    {selectedAppointment.date.split(" ")[1]}
                  </span>
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowAppointmentPanel(false)}
              >
                ×
              </button>
            </div>

            <div className="panel-content">
              {/* Name Field */}
              <div className="form-group">
                <label>Name</label>
                <div className="name-input-container">
                  <input
                    type="text"
                    value={selectedAppointment.clientName}
                    readOnly
                  />
                  <div className="gender-icons">
                    <span className="gender-icon">♂</span>
                    <span className="gender-icon">♀</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="form-group">
                <label>Services</label>
                <div className="appointment-services">
                  {selectedAppointment.services &&
                    selectedAppointment.services.map((service, index) => {
                      const serviceDetail = services.find(
                        (s) => s.id === service.service_id
                      );
                      return (
                        <div key={index} className="service-item-readonly">
                          <span className="service-name">
                            {serviceDetail
                              ? serviceDetail.name
                              : `Service ${service.service_id.substring(0, 8)}`}
                          </span>
                          <span className="service-price">
                            Rs {service.service_price_at_booking}
                          </span>
                          <span className="service-duration">
                            {service.service_duration_at_booking} min
                          </span>
                        </div>
                      );
                    })}
                  {(!selectedAppointment.services ||
                    selectedAppointment.services.length === 0) && (
                    <div className="service-item-readonly">
                      <span className="service-name">
                        {selectedAppointment.service}
                      </span>
                      <span className="service-price">Rs 1400</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="form-group">
                <input
                  type="text"
                  value={selectedAppointment.time}
                  className="time-input-readonly"
                  readOnly
                />
              </div>

              {/* Action Buttons */}
              <div className="appointment-actions">
                <button className="edit-booking-btn">Edit Booking</button>
                <button className="cancel-booking-btn">Cancel booking</button>
              </div>

              {/* Confirm Button */}
              <button className="confirm-btn">Confirm</button>
            </div>
          </>
        )}
      </div>

      {/* Overlay */}
      {(showAddSlotPanel || showAppointmentPanel) && (
        <div
          className="overlay"
          onClick={() => {
            setShowAddSlotPanel(false);
            setShowAppointmentPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default SchedulingInterface;
