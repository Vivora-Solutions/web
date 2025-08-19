import DaySelectionView from "./DaySelectionView";
import CalendarView from "./CalendarView";
import AppointmentPanel from "./AppointmentPanel";
import AppointmentDetailsPanel from "./AppointmentDetailsPanel";
import { ApiService } from "./services/apiService";
import { COLORS } from "./utils/colors";
import SelectionInfo from "./SelectionInfo";
import ScheduleManagementPanel from "./ScheduleManagementPanel";
import Notification from "./Notification";
import Header from "./Header";
import FiltersRow from "./FiltersRow";
import LoadingSpinner from "./LoadingSpinner";
import { useState, useEffect, useRef } from "react";
import { Coffee, Plane, CheckCircle } from "lucide-react";

import { ProtectedAPI } from "../../../../utils/api";

const SchedulingInterface = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [selectedStylists, setSelectedStylists] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedBreakSlots, setSelectedBreakSlots] = useState([]);
  const [selectedLeaveDays, setSelectedLeaveDays] = useState([]);
  const [scheduleType, setScheduleType] = useState("available");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxDays, setMaxDays] = useState(1);
  const [salonId, setSalonId] = useState("");

  // Data states - using real API structure
  const [stylists, setStylists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [services, setServices] = useState([]);

  // Panel states
  const [showAddAppointmentPanel, setShowAddAppointmentPanel] = useState(false);
  const [showAppointmentDetailsPanel, setShowAppointmentDetailsPanel] =
    useState(false);
  const [showScheduleManagementPanel, setShowScheduleManagementPanel] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);
  const [selectedLeavesToDelete, setSelectedLeavesToDelete] = useState([]);

  // Form states
  const [newAppointment, setNewAppointment] = useState({
    id: "",
    clientName: "",
    clientPhone: "",
    services: [],
    stylistId: "",
    date: "",
    startTime: "",
    endTime: "",
    isWalkIn: false,
    notes: "",
    status: "confirmed",
  });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Refs and constants
  const gridRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayFilters = [1, 2, 3, 5];
  const scheduleTypes = [
    {
      value: "available",
      label: "Available",
      icon: CheckCircle,
      color: COLORS.available,
    },
    { value: "break", label: "Break", icon: Coffee, color: COLORS.break },
    { value: "leave", label: "Leave", icon: Plane, color: COLORS.leave },
  ];

  // Notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch appointments
      const appointmentsData = await ApiService.getAppointments();
      console.log("Raw appointments data:", appointmentsData);

      if (appointmentsData && appointmentsData.length > 0) {
        const transformedAppointments = appointmentsData.map((appointment) => ({
          id: appointment.booking_id,
          clientName: appointment.customer
            ? `${appointment.customer.first_name} ${appointment.customer.last_name}`
            : appointment.non_online_customer?.non_online_customer_name ||
              "Walk-in Customer",
          clientPhone:
            appointment.customer?.contact_number ||
            appointment.non_online_customer
              ?.non_online_customer_mobile_number ||
            "",
          stylistId: appointment.stylist?.stylist_id || appointment.stylist_id,
          stylistName: appointment.stylist?.stylist_name || "Unknown Stylist", // Add fallback
          date: appointment.booking_start_datetime.split("T")[0],
          startTime: appointment.booking_start_datetime
            .split("T")[1]
            .substring(0, 5),
          endTime: appointment.booking_end_datetime
            .split("T")[1]
            .substring(0, 5),
          services:
            appointment.booking_services?.map((bs) => bs.service.service_id) ||
            [],
          isWalkIn: !appointment.user_id,
          notes: appointment.notes || "",
          status: appointment.status,
          workstation: appointment.workstation,
          originalData: appointment,
        }));

        console.log("Transformed appointments:", transformedAppointments);
        setAppointments(transformedAppointments);
      } else {
        setAppointments([]);
      }

      // Load all data from API
      const [stylistsData, servicesData, leavesData] = await Promise.all([
        ApiService.getStylists(),
        ApiService.getServices(),
        ApiService.getLeaves(),
      ]);

      setSalonId(stylistsData[0]?.salon_id || "");

      // Transform API data to internal format
      const transformedStylists = stylistsData.map((stylist, index) => ({
        id: stylist.stylist_id,
        name: stylist.stylist_name,
        color: COLORS.stylists[index % COLORS.stylists.length],
        avatar: stylist.profile_pic_link || "👤",
        isActive: stylist.is_active,
        contactNumber: stylist.stylist_contact_number,
        email: stylist.stylist_email,
        bio: stylist.bio,
        schedule: stylist.schedule,
      }));

      // Find the first active stylist
      const firstActiveStylist = transformedStylists.find(
        (stylist) => stylist.isActive
      );

      // Set the first active stylist as selected if one exists
      if (firstActiveStylist) {
        setSelectedStylists([firstActiveStylist.id]);
      }

      const transformedServices = servicesData.map((service) => ({
        id: service.service_id,
        name: service.service_name,
        duration: service.duration_minutes,
        price: service.price,
        category: service.service_category,
        description: service.service_description,
      }));

      setStylists(transformedStylists);
      setServices(transformedServices);
      setLeaves(leavesData);
      generateWeekDates();
    } catch (error) {
      console.error("Error loading data:", error);
      showNotification("Error loading data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateWeekDates();
  }, [selectedDate, maxDays]);

  // Helper functions
  const generateWeekDates = () => {
    const startDate = new Date(selectedDate);
    const dates = [];
    for (let i = 0; i < maxDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    setWeekDates(dates);
  };

  // Helper function to format date consistently without timezone issues
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (hour, minute = 0) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateSlotPosition = (startTime, endTime) => {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const duration = endMinutes - startMinutes;
    const hourHeight = 64;
    const top = (startMinutes / 60) * hourHeight;
    const height = (duration / 60) * hourHeight;
    return { top, height };
  };

  // Drag and selection functions
  const getCellPosition = (e) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const headerHeight = 100;
    const timeColumnWidth = 80;

    if (y < headerHeight || x < timeColumnWidth) return null;

    const availableWidth = rect.width - timeColumnWidth;
    const cellWidth =
      availableWidth / (weekDates.length * selectedStylists.length);
    const cellHeight = 64;
    const totalCellIndex = Math.floor((x - timeColumnWidth) / cellWidth);
    const hourIndex = Math.floor((y - headerHeight) / cellHeight);
    const dateIndex = Math.floor(totalCellIndex / selectedStylists.length);
    const stylistIndex = totalCellIndex % selectedStylists.length;
    const minuteInHour = Math.floor(
      (((y - headerHeight) % cellHeight) / cellHeight) * 60
    );
    const minute = Math.floor(minuteInHour / 15) * 15;

    if (
      dateIndex < 0 ||
      dateIndex >= weekDates.length ||
      stylistIndex < 0 ||
      stylistIndex >= selectedStylists.length ||
      hourIndex < 0 ||
      hourIndex >= 24
    ) {
      return null;
    }

    return {
      dateIndex,
      stylistIndex,
      hourIndex,
      minute,
      stylistId: selectedStylists[stylistIndex],
      date: weekDates[dateIndex],
    };
  };

  const handleMouseDown = (e) => {
    if (scheduleType === "leave") return;
    const position = getCellPosition(e);
    if (!position) return;

    setIsDragging(true);
    setDragStart(position);
    setDragEnd(position);
    setSelectedTimeSlots([]);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart || scheduleType === "leave") return;
    const position = getCellPosition(e);
    if (!position) return;

    setDragEnd(position);
    updateSelection(dragStart, position);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSelection = (start, end) => {
    const slots = [];
    const breakSlots = [];

    // Calculate selection boundaries
    const minDateIndex = Math.min(start.dateIndex, end.dateIndex);
    const maxDateIndex = Math.max(start.dateIndex, end.dateIndex);
    const minStylistIndex = Math.min(start.stylistIndex, end.stylistIndex);
    const maxStylistIndex = Math.max(start.stylistIndex, end.stylistIndex);
    const minTime = Math.min(
      start.hourIndex * 60 + start.minute,
      end.hourIndex * 60 + end.minute
    );
    const maxTime = Math.max(
      start.hourIndex * 60 + start.minute,
      end.hourIndex * 60 + end.minute
    );

    // Helper function to format time consistently
    const formatDateTime = (date, totalMinutes) => {
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      return `${date}T${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00Z`;
    };

    // Group time slots by stylist and date for break slot creation
    const groupedSlots = new Map();

    // Generate all selected slots
    for (let dateIdx = minDateIndex; dateIdx <= maxDateIndex; dateIdx++) {
      for (
        let stylistIdx = minStylistIndex;
        stylistIdx <= maxStylistIndex;
        stylistIdx++
      ) {
        const stylistId = selectedStylists[stylistIdx];
        const date = formatDateToString(weekDates[dateIdx]);
        const groupKey = `${stylistId}-${date}`;

        // Initialize group if not exists
        if (!groupedSlots.has(groupKey)) {
          groupedSlots.set(groupKey, {
            stylistId,
            date,
            timeSlots: [],
          });
        }

        // Add all 15-minute slots in the time range
        for (
          let totalMinutes = minTime;
          totalMinutes <= maxTime;
          totalMinutes += 15
        ) {
          const hour = Math.floor(totalMinutes / 60);
          const minute = totalMinutes % 60;

          // Create slot ID for individual slot tracking
          const slotId = `${stylistId}-${date}-${hour}-${minute}`;
          slots.push(slotId);

          // Add to group for break slot creation
          groupedSlots.get(groupKey).timeSlots.push(totalMinutes);
        }
      }
    }

    // Create break slots by combining consecutive time periods
    groupedSlots.forEach((group) => {
      if (group.timeSlots.length === 0) return;

      // Sort and combine consecutive slots
      const sortedTimes = [...group.timeSlots].sort((a, b) => a - b);
      let blockStart = sortedTimes[0];
      let blockEnd = sortedTimes[0] + 15;

      for (let i = 1; i < sortedTimes.length; i++) {
        const currentTime = sortedTimes[i];

        if (currentTime <= blockEnd) {
          // Extend current block
          blockEnd = currentTime + 15;
        } else {
          // Save current block and start new one
          breakSlots.push([
            formatDateTime(group.date, blockStart),
            formatDateTime(group.date, blockEnd),
            group.date,
          ]);

          blockStart = currentTime;
          blockEnd = currentTime + 15;
        }
      }

      // Add the final block
      breakSlots.push([
        formatDateTime(group.date, blockStart),
        formatDateTime(group.date, blockEnd),
        group.date,
      ]);
    });

    setSelectedBreakSlots(breakSlots);
    setSelectedTimeSlots(slots);
  };

  const isSlotSelected = (stylistId, date, hour, minute = 0) => {
    const slotId = `${stylistId}-${formatDateToString(date)}-${hour}-${minute}`;
    return selectedTimeSlots.includes(slotId);
  };

  // Check if a time slot is within stylist's working schedule
  const isTimeSlotAvailable = (stylistId, date, hour, minute = 0) => {
    const stylist = stylists.find((s) => s.id === stylistId);
    if (!stylist || !stylist.schedule || stylist.schedule.length === 0) {
      return true; // If no schedule defined, assume all times are available
    }

    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTimeMinutes = hour * 60 + minute;

    // Check if the stylist has any schedule for this day of week
    const daySchedules = stylist.schedule.filter(
      (schedule) => schedule.day_of_week === dayOfWeek
    );

    if (daySchedules.length === 0) {
      return false; // No schedule for this day = not available
    }

    // Check if current time falls within any of the scheduled time ranges for this day
    return daySchedules.some((schedule) => {
      const startTimeParts = schedule.start_time_daily.split(":");
      const endTimeParts = schedule.end_time_daily.split(":");
      const startMinutes =
        parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
      const endMinutes =
        parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1]);

      return (
        currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes
      );
    });
  };

  // Leave day selection
  const handleDayClick = (date) => {
    if (scheduleType !== "leave") return;
    const dateStr = formatDateToString(date);
    setSelectedLeaveDays((prev) => {
      if (prev.includes(dateStr)) {
        return prev.filter((d) => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const isDaySelected = (date) => {
    const dateStr = formatDateToString(date);
    return selectedLeaveDays.includes(dateStr);
  };

  // Check if stylist has leave on a specific date
  const hasLeaveOnDate = (stylistId, date) => {
    const dateStr = formatDateToString(date);
    return leaves.some(
      (leave) => leave.stylist_id === stylistId && leave.date === dateStr
    );
  };

  // Check if stylist has leave on a specific time slot
  const hasLeaveAtTimeSlot = (stylistId, date, hour, minute = 0) => {
    const currentSlotStart = `${formatDateToString(date)}T${hour
      .toString()
      .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00+00:00`;
    let endHour = hour;
    let endMinute = minute + 15;
    if (endMinute >= 60) {
      endHour += 1;
      endMinute -= 60;
    }
    const currentSlotEnd = `${formatDateToString(date)}T${endHour
      .toString()
      .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}:00+00:00`;

    return leaves.some((leave) => {
      if (leave.stylist_id !== stylistId) return false;

      const leaveStart = new Date(leave.leave_start_time).getTime();
      const leaveEnd = new Date(leave.leave_end_time).getTime();
      const slotStart = new Date(currentSlotStart).getTime();
      const slotEnd = new Date(currentSlotEnd).getTime();

      // Check if there's any overlap between leave period and current time slot
      return leaveStart < slotEnd && leaveEnd > slotStart;
    });
  };

  // Stylist management
  const handleStylistToggle = (stylistId) => {
    setSelectedStylists((prev) => {
      if (prev.includes(stylistId)) {
        return prev.filter((id) => id !== stylistId);
      } else {
        return [...prev, stylistId];
      }
    });
  };
  // Appointment management
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailsPanel(true);
    setIsEditingAppointment(false);
  };

  const handleAddAppointment = () => {
    const today = new Date();
    const localDate = formatDateToString(today);
    setNewAppointment({
      id: "",
      clientName: "",
      clientPhone: "",
      services: [],
      stylistId: selectedStylists[0] || "",
      date: localDate,
      startTime: "09:00",
      endTime: "10:00",
      isWalkIn: false,
      notes: "",
      status: "confirmed",
    });
    setAvailableTimeSlots([]); // Reset available time slots
    setShowAddAppointmentPanel(true);
    setIsEditingAppointment(false);
  };

  // Check availability function
  const handleCheckAvailability = async () => {
    if (
      !newAppointment.stylistId ||
      !newAppointment.date ||
      newAppointment.services.length === 0
    ) {
      showNotification(
        "Please select stylist, date, and services first",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Prepare the API request data
      console.log("Checking availability for appointment:", stylists[0]);
      const requestData = {
        service_ids: newAppointment.services,
        stylist_id: newAppointment.stylistId,
        salon_id: salonId, // Use actual salon ID from context
        date: newAppointment.date,
      };

      console.log("Checking availability with data:", requestData);

      // Call the backend API to get available time slots
      const response = await ProtectedAPI.post(
        "/salons/available-time-slots-sithum",
        requestData
      );
      console.log("Availability response:", response.data);
      if (response.data.success && response.data.data) {
        const slots = response.data.data.map((slot) => ({
          startTime: slot.start,
          endTime: slot.end,
        }));

        setAvailableTimeSlots(slots);

        if (slots.length === 0) {
          showNotification(
            "No available time slots found for the selected date and services",
            "error"
          );
        } else {
          showNotification(
            `Found ${slots.length} available time slots`,
            "success"
          );
        }
      } else {
        showNotification("No available time slots found", "error");
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error("Error checking availability:", error);

      // Handle different types of errors
      if (error.response?.status === 400) {
        showNotification(
          error.response.data.error || "Invalid request data",
          "error"
        );
      } else if (error.response?.status === 500) {
        showNotification(
          error.response.data.details || "Server error",
          "error"
        );
      } else {
        showNotification(
          "Failed to check availability. Please try again.",
          "error"
        );
      }

      setAvailableTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppointment = async () => {
    try {
      setLoading(true);

      // Validate form
      if (
        !newAppointment.clientName ||
        !newAppointment.stylistId ||
        !newAppointment.date ||
        !newAppointment.startTime ||
        !newAppointment.endTime
      ) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      if (newAppointment.services.length === 0) {
        showNotification("Please select at least one service", "error");
        return;
      }

      // Check for time conflicts
      const conflictingAppointment = appointments.find(
        (apt) =>
          apt.id !== newAppointment.id &&
          apt.stylistId === newAppointment.stylistId &&
          apt.date === newAppointment.date &&
          ((parseTimeToMinutes(newAppointment.startTime) >=
            parseTimeToMinutes(apt.startTime) &&
            parseTimeToMinutes(newAppointment.startTime) <
              parseTimeToMinutes(apt.endTime)) ||
            (parseTimeToMinutes(newAppointment.endTime) >
              parseTimeToMinutes(apt.startTime) &&
              parseTimeToMinutes(newAppointment.endTime) <=
                parseTimeToMinutes(apt.endTime)))
      );

      if (conflictingAppointment) {
        showNotification(
          "Time slot conflicts with existing appointment",
          "error"
        );
        return;
      }

      let result;
      if (isEditingAppointment) {
        result = await ApiService.updateAppointment(
          newAppointment.id,
          newAppointment
        );
        showNotification("Appointment updated successfully!");
      } else {
        newAppointment.isWalkIn = true;
        result = await ApiService.createAppointment(newAppointment);
        showNotification("Appointment created successfully!");
      }

      setShowAddAppointmentPanel(false);
      resetAppointmentForm();

      // Reload data to reflect changes and fix any display issues
      await loadData();
    } catch (error) {
      console.error("Error saving appointment:", error);

      // Show more specific error messages from backend
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, "error");
      } else if (error.response?.data?.message) {
        showNotification(error.response.data.message, "error");
      } else if (error.message) {
        showNotification(error.message, "error");
      } else {
        showNotification(
          "Error saving appointment. Please try again.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      setLoading(true);
      await ApiService.deleteAppointment(appointmentId);
      setShowAppointmentDetailsPanel(false);
      setSelectedAppointment(null);
      showNotification("Appointment deleted successfully!");

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showNotification(
        "Error deleting appointment. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await ApiService.completeAppointment(appointmentId);
      setShowAppointmentDetailsPanel(false);
      setSelectedAppointment(null);
      showNotification("Appointment completed successfully!");

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      console.error("Error completing appointment:", error);
      showNotification(
        "Error completing appointment. Please try again.",
        "error"
      );
    }
  };

  const resetAppointmentForm = () => {
    setNewAppointment({
      id: "",
      clientName: "",
      clientPhone: "",
      services: [],
      stylistId: "",
      date: "",
      startTime: "",
      endTime: "",
      isWalkIn: false,
      notes: "",
      status: "confirmed",
    });
  };

  // Schedule management
  const handleSaveSchedule = async () => {
    try {
      setLoading(true);

      if (scheduleType === "leave") {
        // Save leave days
        for (const dateStr of selectedLeaveDays) {
          for (const stylistId of selectedStylists) {
            await ApiService.createLeave({
              stylist_id: stylistId,
              date: dateStr,
              leave_start_time: `${dateStr}T00:00:00Z`,
              leave_end_time: `${dateStr}T23:59:59Z`,
            });
          }
        }
        showNotification(
          `Leave saved! ${selectedLeaveDays.length} day(s) marked for leave.`
        );
        setSelectedLeaveDays([]);
      } else if (scheduleType === "break") {
        for (const stylistId of selectedStylists) {
          for (const dateStr of selectedBreakSlots) {
            const data = {
              stylist_id: stylistId,
              date: dateStr[2], // Extract date from slot ID
              leave_start_time: dateStr[0],
              leave_end_time: dateStr[1],
            };
            console.log("Creating break leave with data:", data);
            await ApiService.createLeave(data);
          }
        }
        showNotification(
          `Leave saved! ${selectedLeaveDays.length} day(s) marked for leave.`
        );
        setSelectedLeaveDays([]);
      } else {
        // Save schedule slots
        await ApiService.updateStylistSchedule(selectedStylists, {
          type: scheduleType,
          slots: selectedTimeSlots,
        });
        showNotification(
          `Schedule saved! ${selectedTimeSlots.length} time slot(s) marked as ${scheduleType}.`
        );
        setSelectedTimeSlots([]);
      }

      // Reload data to reflect changes
      await loadData();
    } catch (error) {
      // Extract specific error messages from backend response
      let errorMessage = "Error saving schedule. Please try again.";

      if (error.response?.data?.error) {
        // Backend sends error in { error: "message" } format
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        // Alternative message field
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // JavaScript error message
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const navigateDateRange = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * maxDays);
    setSelectedDate(newDate);
  };

  // Get appointments for display
  const getAppointmentsForDate = (date, stylistId) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return appointments.filter(
      (apt) => apt.date === dateStr && apt.stylistId === stylistId
    );
  };

  const getStylistById = (id) => {
    return (
      stylists.find((s) => s.id === id) || {
        id,
        name: `Stylist ${id}`,
        color: COLORS.stylists[0],
        avatar: "👤",
      }
    );
  };

  const getServiceById = (id) => {
    return (
      services.find((s) => s.id === id) || {
        id,
        name: "Unknown Service",
        duration: 30,
        price: 0,
      }
    );
  };

  // Helper function to get upcoming leaves
  const getUpcomingLeaves = () => {
    const today = new Date();
    const localToday = formatDateToString(today);
    return leaves.filter((leave) => leave.date >= localToday);
  };

  // Helper function to handle leave selection for deletion
  const handleLeaveSelection = (leaveId) => {
    setSelectedLeavesToDelete((prev) => {
      if (prev.includes(leaveId)) {
        return prev.filter((id) => id !== leaveId);
      } else {
        return [...prev, leaveId];
      }
    });
  };

  // Helper function to handle bulk leave deletion
  const handleDeleteSelectedLeaves = async () => {
    if (selectedLeavesToDelete.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedLeavesToDelete.length} leave(s)?`
      )
    )
      return;

    try {
      setLoading(true);

      for (const leaveId of selectedLeavesToDelete) {
        const leave = leaves.find((l) => l.leave_id === leaveId);
        if (leave) {
          await ApiService.deleteLeave({
            stylist_id: leave.stylist_id,
            leave_id: leaveId,
          });
        }
      }

      // Remove deleted leaves from state
      setLeaves((prev) =>
        prev.filter((leave) => !selectedLeavesToDelete.includes(leave.leave_id))
      );
      setSelectedLeavesToDelete([]);
      showNotification(
        `Successfully deleted ${selectedLeavesToDelete.length} leave(s)!`
      );
    } catch (error) {
      console.error("Error deleting leaves:", error);
      showNotification("Error deleting leaves. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  const selectedStylistsData = stylists.filter((s) =>
    selectedStylists.includes(s.id)
  );

  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-br from-[${COLORS.primary}] to-[${COLORS.secondary}]">
      {/* Notification */}
      <Notification
        message={notification?.message}
        type={notification?.type}
        COLORS={COLORS}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col bg-[${COLORS.background}] z-10 w-full">
        {/* Enhanced Header with Filters */}
        <div className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-lg border-b border-[${COLORS.border}] shadow-sm shrink-0 w-full">
          {/* Title Section */}
          <Header
            title="Salon Scheduler"
            subtitle="Unified scheduling system for appointments and staff schedules"
            COLORS={COLORS}
            navigateDateRange={navigateDateRange}
            weekDates={weekDates}
            maxDays={maxDays}
            formatDate={formatDate}
            setShowScheduleManagementPanel={setShowScheduleManagementPanel}
            setSelectedLeavesToDelete={setSelectedLeavesToDelete}
            handleAddAppointment={handleAddAppointment}
          />

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mt-6 w-full overflow-x-auto">
            <FiltersRow
              maxDays={maxDays}
              setMaxDays={setMaxDays}
              dayFilters={dayFilters}
              scheduleType={scheduleType}
              setScheduleType={setScheduleType}
              setSelectedTimeSlots={setSelectedTimeSlots}
              setSelectedLeaveDays={setSelectedLeaveDays}
              scheduleTypes={scheduleTypes}
              stylists={stylists}
              selectedStylists={selectedStylists}
              setSelectedStylists={setSelectedStylists}
              handleStylistToggle={handleStylistToggle}
              COLORS={COLORS}
            />
          </div>
        </div>

        {/* Main Content - Fixed Layout */}
        <div className="flex-1 flex flex-col bg-[${COLORS.background}] z-10">
          {/* Enhanced Calendar Controls */}
          <div className="bg-gray-50 border-b border-[${COLORS.border}] p-5 md:p-8 shrink-0">
            <div className="flex justify-between items-center">
              {/* Selection Info */}
              <SelectionInfo
                selectedTimeSlots={selectedTimeSlots}
                selectedLeaveDays={selectedLeaveDays}
                scheduleType={scheduleType}
                COLORS={COLORS}
                selectedStylistsData={selectedStylistsData}
              />
            </div>
          </div>

          {/* Content Area - Embedded Calendar */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <LoadingSpinner COLORS={COLORS} />
            ) : scheduleType === "leave" ? (
              <DaySelectionView
                weekDates={weekDates}
                isDaySelected={isDaySelected}
                handleDayClick={handleDayClick}
                COLORS={COLORS}
              />
            ) : (
              <CalendarView
                selectedStylists={selectedStylists}
                selectedStylistsData={selectedStylistsData}
                weekDates={weekDates}
                stylists={stylists}
                appointments={appointments}
                isDragging={isDragging}
                gridRef={gridRef}
                handleMouseDown={handleMouseDown}
                isSlotSelected={isSlotSelected}
                hasLeaveOnDate={hasLeaveOnDate}
                hasLeaveAtTimeSlot={hasLeaveAtTimeSlot}
                isTimeSlotAvailable={isTimeSlotAvailable}
                getAppointmentsForDate={getAppointmentsForDate}
                calculateSlotPosition={calculateSlotPosition}
                handleAppointmentClick={handleAppointmentClick}
                COLORS={COLORS}
                formatTime={formatTime}
                formatDateToString={formatDateToString}
              />
            )}
          </div>
        </div>

        {/* Enhanced Add/Edit Appointment Panel */}
        <AppointmentPanel
          showAddAppointmentPanel={showAddAppointmentPanel}
          setShowAddAppointmentPanel={setShowAddAppointmentPanel}
          isEditingAppointment={isEditingAppointment}
          newAppointment={newAppointment}
          setNewAppointment={setNewAppointment}
          availableTimeSlots={availableTimeSlots}
          setAvailableTimeSlots={setAvailableTimeSlots}
          loading={loading}
          stylists={stylists}
          services={services}
          handleCheckAvailability={handleCheckAvailability}
          handleSaveAppointment={handleSaveAppointment}
          COLORS={COLORS}
        />

        {/* Enhanced Appointment Details Panel */}
        <AppointmentDetailsPanel
          show={showAppointmentDetailsPanel}
          onClose={() => setShowAppointmentDetailsPanel(false)}
          appointment={selectedAppointment}
          COLORS={COLORS}
          getStylistById={getStylistById}
          getServiceById={getServiceById}
          handleDeleteAppointment={handleDeleteAppointment}
          handleCompleteAppointment={handleCompleteAppointment}
          loading={loading}
        />

        {/* Enhanced Schedule Management Panel */}
        <ScheduleManagementPanel
          showScheduleManagementPanel={showScheduleManagementPanel}
          setShowScheduleManagementPanel={setShowScheduleManagementPanel}
          scheduleType={scheduleType}
          setScheduleType={setScheduleType}
          scheduleTypes={scheduleTypes}
          selectedTimeSlots={selectedTimeSlots}
          selectedLeaveDays={selectedLeaveDays}
          selectedBreakSlots={selectedBreakSlots}
          selectedLeavesToDelete={selectedLeavesToDelete}
          setSelectedLeavesToDelete={setSelectedLeavesToDelete}
          selectedStylists={selectedStylists}
          handleSaveSchedule={handleSaveSchedule}
          handleDeleteSelectedLeaves={handleDeleteSelectedLeaves}
          handleLeaveSelection={handleLeaveSelection}
          getStylistById={getStylistById}
          getUpcomingLeaves={getUpcomingLeaves}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SchedulingInterface;
