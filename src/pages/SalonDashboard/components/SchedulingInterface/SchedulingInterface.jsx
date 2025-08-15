"use client"
import { COLORS } from "./colours"
import { ApiService } from "./ApiService"
import { useState, useEffect, useRef } from "react"
import { ProtectedAPI } from "../../../../utils/api"
import { parseTimeToMinutes, formatDateToString, formatDateTime, formatTime, formatDate } from "./timeUtils"
import { DaySelectionView } from "./DaySelectionView"
import AppointmentDetailsPanel from "./AppointmentDetailsPanel"
import ScheduleManagementPanel from './ScheduleManagementPanel'
import AddEditAppointmentPanel from "./AddEditAppointmentPanel"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Coffee,
  Plane,
  CheckCircle,
  PersonStandingIcon,
  Phone,
  Plus,
  Calendar,
  Users,
  Clock,
  User,
  Settings,
  Filter,
  MapPin,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react"


const SchedulingInterface = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState([])
  const [selectedStylists, setSelectedStylists] = useState([])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])
  const [selectedBreakSlots, setSelectedBreakSlots] = useState([])
  const [selectedLeaveDays, setSelectedLeaveDays] = useState([])
  const [scheduleType, setScheduleType] = useState("available")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [dragEnd, setDragEnd] = useState(null)
  const [loading, setLoading] = useState(false)
  const [maxDays, setMaxDays] = useState(1)
  const [salonId, setSalonId] = useState("")

  // Data states - using real API structure
  const [stylists, setStylists] = useState([])
  const [appointments, setAppointments] = useState([])
  const [leaves, setLeaves] = useState([])
  const [services, setServices] = useState([])

  // Panel states
  const [showAddAppointmentPanel, setShowAddAppointmentPanel] = useState(false)
  const [showAppointmentDetailsPanel, setShowAppointmentDetailsPanel] = useState(false)
  const [showScheduleManagementPanel, setShowScheduleManagementPanel] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isEditingAppointment, setIsEditingAppointment] = useState(false)
  const [selectedLeavesToDelete, setSelectedLeavesToDelete] = useState([])

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
  })
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])

  // Notification state
  const [notification, setNotification] = useState(null)

  // Refs and constants
  const gridRef = useRef(null)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const dayFilters = [1, 2, 3, 4]
  const scheduleTypes = [
    { value: "available", label: "Available", icon: CheckCircle, color: COLORS.available },
    { value: "break", label: "Break", icon: Coffee, color: COLORS.break },
    { value: "leave", label: "Leave", icon: Plane, color: COLORS.leave },
  ]

  // Notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Initialize data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load all data from API
      const [stylistsData, appointmentsData, servicesData, leavesData] = await Promise.all([
        ApiService.getStylists(),
        ApiService.getAppointments(),
        ApiService.getServices(),
        ApiService.getLeaves(),
      ])

      setSalonId(stylistsData[0]?.salon_id || "")

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
      }))

      const transformedAppointments = appointmentsData.map((appointment) => ({
        id: appointment.booking_id,
        clientName: appointment.customer
          ? `${appointment.customer.first_name} ${appointment.customer.last_name}`
          : appointment.non_online_customer?.non_online_customer_name || "Walk-in Customer",
        clientPhone:
          appointment.customer?.contact_number ||
          appointment.non_online_customer?.non_online_customer_mobile_number ||
          "",
        stylistId: appointment.stylist.stylist_id,
        // Fix timezone issue by parsing UTC dates correctly without additional timezone conversion
        date: appointment.booking_start_datetime.split("T")[0],
        startTime: appointment.booking_start_datetime.split("T")[1].substring(0, 5), // Extract HH:MM from ISO string
        endTime: appointment.booking_end_datetime.split("T")[1].substring(0, 5), // Extract HH:MM from ISO string
        services: appointment.booking_services.map((bs) => bs.service.service_id),
        isWalkIn: !appointment.user_id,
        notes: appointment.notes || "",
        status: appointment.status,
        workstation: appointment.workstation,
        originalData: appointment, // Keep original for API calls
      }))

      const transformedServices = servicesData.map((service) => ({
        id: service.service_id,
        name: service.service_name,
        duration: service.duration_minutes,
        price: service.price,
        category: service.service_category,
        description: service.service_description,
      }))

      setStylists(transformedStylists)
      setAppointments(transformedAppointments)
      setServices(transformedServices)
      setLeaves(leavesData)
      setSelectedStylists([]) // Keep stylists deselected by default
      generateWeekDates()
    } catch (error) {
      console.error("Error loading data:", error)
      showNotification("Error loading data. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateWeekDates()
  }, [selectedDate, maxDays])

  // Helper functions
  const generateWeekDates = () => {
    const startDate = new Date(selectedDate)
    const dates = []
    for (let i = 0; i < maxDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    setWeekDates(dates)
  }


  const calculateSlotPosition = (startTime, endTime) => {
    const startMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(endTime)
    const duration = endMinutes - startMinutes
    const hourHeight = 64
    const top = (startMinutes / 60) * hourHeight
    const height = (duration / 60) * hourHeight
    return { top, height }
  }

  // Drag and selection functions
  const getCellPosition = (e) => {
    if (!gridRef.current) return null
    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const headerHeight = 100
    const timeColumnWidth = 80

    if (y < headerHeight || x < timeColumnWidth) return null

    const availableWidth = rect.width - timeColumnWidth
    const cellWidth = availableWidth / (weekDates.length * selectedStylists.length)
    const cellHeight = 64
    const totalCellIndex = Math.floor((x - timeColumnWidth) / cellWidth)
    const hourIndex = Math.floor((y - headerHeight) / cellHeight)
    const dateIndex = Math.floor(totalCellIndex / selectedStylists.length)
    const stylistIndex = totalCellIndex % selectedStylists.length
    const minuteInHour = Math.floor((((y - headerHeight) % cellHeight) / cellHeight) * 60)
    const minute = Math.floor(minuteInHour / 15) * 15

    if (
      dateIndex < 0 ||
      dateIndex >= weekDates.length ||
      stylistIndex < 0 ||
      stylistIndex >= selectedStylists.length ||
      hourIndex < 0 ||
      hourIndex >= 24
    ) {
      return null
    }

    return {
      dateIndex,
      stylistIndex,
      hourIndex,
      minute,
      stylistId: selectedStylists[stylistIndex],
      date: weekDates[dateIndex],
    }
  }

  const handleMouseDown = (e) => {
    if (scheduleType === "leave") return
    const position = getCellPosition(e)
    if (!position) return

    setIsDragging(true)
    setDragStart(position)
    setDragEnd(position)
    setSelectedTimeSlots([])
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart || scheduleType === "leave") return
    const position = getCellPosition(e)
    if (!position) return

    setDragEnd(position)
    updateSelection(dragStart, position)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateSelection = (start, end) => {
    const slots = []
    const breakSlots = []

    // Calculate selection boundaries
    const minDateIndex = Math.min(start.dateIndex, end.dateIndex)
    const maxDateIndex = Math.max(start.dateIndex, end.dateIndex)
    const minStylistIndex = Math.min(start.stylistIndex, end.stylistIndex)
    const maxStylistIndex = Math.max(start.stylistIndex, end.stylistIndex)
    const minTime = Math.min(start.hourIndex * 60 + start.minute, end.hourIndex * 60 + end.minute)
    const maxTime = Math.max(start.hourIndex * 60 + start.minute, end.hourIndex * 60 + end.minute)

    // Helper function to format time consistently
    // const formatDateTime = (date, totalMinutes) => {
    //   const hour = Math.floor(totalMinutes / 60)
    //   const minute = totalMinutes % 60
    //   return `${date}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00Z`
    // }

    // Group time slots by stylist and date for break slot creation
    const groupedSlots = new Map()

    // Generate all selected slots
    for (let dateIdx = minDateIndex; dateIdx <= maxDateIndex; dateIdx++) {
      for (let stylistIdx = minStylistIndex; stylistIdx <= maxStylistIndex; stylistIdx++) {
        const stylistId = selectedStylists[stylistIdx]
        const date = formatDateToString(weekDates[dateIdx])
        const groupKey = `${stylistId}-${date}`

        // Initialize group if not exists
        if (!groupedSlots.has(groupKey)) {
          groupedSlots.set(groupKey, {
            stylistId,
            date,
            timeSlots: []
          })
        }

        // Add all 15-minute slots in the time range
        for (let totalMinutes = minTime; totalMinutes <= maxTime; totalMinutes += 15) {
          const hour = Math.floor(totalMinutes / 60)
          const minute = totalMinutes % 60

          // Create slot ID for individual slot tracking
          const slotId = `${stylistId}-${date}-${hour}-${minute}`
          slots.push(slotId)

          // Add to group for break slot creation
          groupedSlots.get(groupKey).timeSlots.push(totalMinutes)
        }
      }
    }

    // Create break slots by combining consecutive time periods
    groupedSlots.forEach(group => {
      if (group.timeSlots.length === 0) return

      // Sort and combine consecutive slots
      const sortedTimes = [...group.timeSlots].sort((a, b) => a - b)
      let blockStart = sortedTimes[0]
      let blockEnd = sortedTimes[0] + 15

      for (let i = 1; i < sortedTimes.length; i++) {
        const currentTime = sortedTimes[i]

        if (currentTime <= blockEnd) {
          // Extend current block
          blockEnd = currentTime + 15
        } else {
          // Save current block and start new one
          breakSlots.push([
            formatDateTime(group.date, blockStart),
            formatDateTime(group.date, blockEnd),
            group.date
          ])

          blockStart = currentTime
          blockEnd = currentTime + 15
        }
      }

      // Add the final block
      breakSlots.push([
        formatDateTime(group.date, blockStart),
        formatDateTime(group.date, blockEnd),
        group.date
      ])
    })

    setSelectedBreakSlots(breakSlots)
    setSelectedTimeSlots(slots)
  }

  const isSlotSelected = (stylistId, date, hour, minute = 0) => {
    const slotId = `${stylistId}-${formatDateToString(date)}-${hour}-${minute}`
    return selectedTimeSlots.includes(slotId)
  }

  // Check if a time slot is within stylist's working schedule
  const isTimeSlotAvailable = (stylistId, date, hour, minute = 0) => {
    const stylist = stylists.find(s => s.id === stylistId)
    if (!stylist || !stylist.schedule || stylist.schedule.length === 0) {
      return true // If no schedule defined, assume all times are available
    }

    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    const currentTimeMinutes = hour * 60 + minute

    // Check if the stylist has any schedule for this day of week
    const daySchedules = stylist.schedule.filter(schedule => schedule.day_of_week === dayOfWeek)

    if (daySchedules.length === 0) {
      return false // No schedule for this day = not available
    }

    // Check if current time falls within any of the scheduled time ranges for this day
    return daySchedules.some(schedule => {
      const startTimeParts = schedule.start_time_daily.split(':')
      const endTimeParts = schedule.end_time_daily.split(':')
      const startMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1])
      const endMinutes = parseInt(endTimeParts[0]) * 60 + parseInt(endTimeParts[1])

      return currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes
    })
  }

  // Leave day selection
  const handleDayClick = (date) => {
    if (scheduleType !== "leave") return
    const dateStr = formatDateToString(date)
    setSelectedLeaveDays((prev) => {
      if (prev.includes(dateStr)) {
        return prev.filter((d) => d !== dateStr)
      } else {
        return [...prev, dateStr]
      }
    })
  }



  // Check if stylist has leave on a specific date
  const hasLeaveOnDate = (stylistId, date) => {
    const dateStr = formatDateToString(date)
    return leaves.some((leave) => leave.stylist_id === stylistId && leave.date === dateStr)
  }

  // Check if stylist has leave on a specific time slot
  const hasLeaveAtTimeSlot = (stylistId, date, hour, minute = 0) => {
    const currentSlotStart = `${formatDateToString(date)}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00+00:00`
    let endHour = hour
    let endMinute = minute + 15
    if (endMinute >= 60) {
      endHour += 1
      endMinute -= 60
    }
    const currentSlotEnd = `${formatDateToString(date)}T${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}:00+00:00`

    return leaves.some((leave) => {
      if (leave.stylist_id !== stylistId) return false

      const leaveStart = new Date(leave.leave_start_time).getTime()
      const leaveEnd = new Date(leave.leave_end_time).getTime()
      const slotStart = new Date(currentSlotStart).getTime()
      const slotEnd = new Date(currentSlotEnd).getTime()

      // Check if there's any overlap between leave period and current time slot
      return leaveStart < slotEnd && leaveEnd > slotStart
    })
  }

  // Stylist management
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
    const allStylistIds = stylists.filter((s) => s.isActive).map((s) => s.id)
    if (selectedStylists.length === allStylistIds.length) {
      setSelectedStylists([])
    } else {
      setSelectedStylists(allStylistIds)
    }
  }

  // Appointment management
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentDetailsPanel(true)
    setIsEditingAppointment(false)
  }

  const handleAddAppointment = () => {
    const today = new Date()
    const localDate = formatDateToString(today)
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
    })
    setAvailableTimeSlots([]) // Reset available time slots
    setShowAddAppointmentPanel(true)
    setIsEditingAppointment(false)
  }

  const handleEditAppointment = (appointment) => {
    console.log("Editing appointment:", appointment)
    setNewAppointment({
      id: appointment.id,
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      services: appointment.services,
      stylistId: appointment.stylistId,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      isWalkIn: appointment.isWalkIn,
      notes: appointment.notes,
      status: appointment.status,
    })
    setAvailableTimeSlots([]) // Reset available time slots for editing
    setShowAddAppointmentPanel(true)
    setIsEditingAppointment(true)
    setShowAppointmentDetailsPanel(false)
  }

  // Check availability function
  const handleCheckAvailability = async () => {
    if (!newAppointment.stylistId || !newAppointment.date || newAppointment.services.length === 0) {
      showNotification("Please select stylist, date, and services first", "error")
      return
    }

    setLoading(true)
    try {
      // Prepare the API request data
      console.log("Checking availability for appointment:", stylists[0])
      const requestData = {
        service_ids: newAppointment.services,
        stylist_id: newAppointment.stylistId,
        salon_id: salonId, // Use actual salon ID from context
        date: newAppointment.date
      }

      console.log("Checking availability with data:", requestData)

      // Call the backend API to get available time slots
      const response = await ProtectedAPI.post("/salons/available-time-slots-sithum", requestData)
      console.log("Availability response:", response.data)
      if (response.data.success && response.data.data) {
        const slots = response.data.data.map(slot => ({
          startTime: slot.start,
          endTime: slot.end
        }))

        setAvailableTimeSlots(slots)

        if (slots.length === 0) {
          showNotification("No available time slots found for the selected date and services", "error")
        } else {
          showNotification(`Found ${slots.length} available time slots`, "success")
        }
      } else {
        showNotification("No available time slots found", "error")
        setAvailableTimeSlots([])
      }
    } catch (error) {
      console.error("Error checking availability:", error)

      // Handle different types of errors
      if (error.response?.status === 400) {
        showNotification(error.response.data.error || "Invalid request data", "error")
      } else if (error.response?.status === 500) {
        showNotification(error.response.data.details || "Server error", "error")
      } else {
        showNotification("Failed to check availability. Please try again.", "error")
      }

      setAvailableTimeSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAppointment = async () => {
    try {
      setLoading(true)

      // Validate form
      if (
        !newAppointment.clientName ||
        !newAppointment.stylistId ||
        !newAppointment.date ||
        !newAppointment.startTime ||
        !newAppointment.endTime
      ) {
        showNotification("Please fill in all required fields", "error")
        return
      }

      if (newAppointment.services.length === 0) {
        showNotification("Please select at least one service", "error")
        return
      }

      // Check for time conflicts
      const conflictingAppointment = appointments.find(
        (apt) =>
          apt.id !== newAppointment.id &&
          apt.stylistId === newAppointment.stylistId &&
          apt.date === newAppointment.date &&
          ((parseTimeToMinutes(newAppointment.startTime) >= parseTimeToMinutes(apt.startTime) &&
            parseTimeToMinutes(newAppointment.startTime) < parseTimeToMinutes(apt.endTime)) ||
            (parseTimeToMinutes(newAppointment.endTime) > parseTimeToMinutes(apt.startTime) &&
              parseTimeToMinutes(newAppointment.endTime) <= parseTimeToMinutes(apt.endTime))),
      )

      if (conflictingAppointment) {
        showNotification("Time slot conflicts with existing appointment", "error")
        return
      }

      let result
      if (isEditingAppointment) {
        result = await ApiService.updateAppointment(newAppointment.id, newAppointment)
        showNotification("Appointment updated successfully!")
      } else {
        newAppointment.isWalkIn = true;
        result = await ApiService.createAppointment(newAppointment)
        showNotification("Appointment created successfully!")
      }

      setShowAddAppointmentPanel(false)
      resetAppointmentForm()

      // Reload data to reflect changes and fix any display issues
      await loadData()
    } catch (error) {
      console.error("Error saving appointment:", error)

      // Show more specific error messages from backend
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, "error")
      } else if (error.response?.data?.message) {
        showNotification(error.response.data.message, "error")
      } else if (error.message) {
        showNotification(error.message, "error")
      } else {
        showNotification("Error saving appointment. Please try again.", "error")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return

    try {
      setLoading(true)
      await ApiService.deleteAppointment(appointmentId)
      setShowAppointmentDetailsPanel(false)
      setSelectedAppointment(null)
      showNotification("Appointment deleted successfully!")

      // Reload data to reflect changes
      await loadData()
    } catch (error) {
      console.error("Error deleting appointment:", error)
      showNotification("Error deleting appointment. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await ApiService.completeAppointment(appointmentId)
      setShowAppointmentDetailsPanel(false)
      setSelectedAppointment(null)
      showNotification("Appointment completed successfully!")

      // Reload data to reflect changes
      await loadData()
    } catch (error) {
      console.error("Error completing appointment:", error)
      showNotification("Error completing appointment. Please try again.", "error")
    }
  }

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
    })
  }

  // Schedule management
  const handleSaveSchedule = async () => {
    try {
      setLoading(true)

      if (scheduleType === "leave") {
        // Save leave days
        for (const dateStr of selectedLeaveDays) {
          for (const stylistId of selectedStylists) {
            await ApiService.createLeave({
              stylist_id: stylistId,
              date: dateStr,
              leave_start_time: `${dateStr}T00:00:00+00`,
              leave_end_time: `${dateStr}T23:59:59+00`,
            })
          }
        }
        showNotification(`Leave saved! ${selectedLeaveDays.length} day(s) marked for leave.`)
        setSelectedLeaveDays([])
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
        showNotification(`Leave saved! ${selectedLeaveDays.length} day(s) marked for leave.`)
        setSelectedLeaveDays([])
      } else {
        // Save schedule slots
        await ApiService.updateStylistSchedule(selectedStylists, {
          type: scheduleType,
          slots: selectedTimeSlots,
        })
        showNotification(`Schedule saved! ${selectedTimeSlots.length} time slot(s) marked as ${scheduleType}.`)
        setSelectedTimeSlots([])
      }

      // Reload data to reflect changes
      await loadData()
    } catch (error) {
      console.error("Error saving schedule:", error)
      showNotification("Error saving schedule. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Navigation
  const navigateDateRange = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + direction * maxDays)
    setSelectedDate(newDate)
  }

  // Get appointments for display
  const getAppointmentsForDate = (date, stylistId) => {
    // Use local date string to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    return appointments.filter((apt) => apt.date === dateStr && apt.stylistId === stylistId)
  }

  const getStylistById = (id) => {
    return (
      stylists.find((s) => s.id === id) || {
        id,
        name: `Stylist ${id}`,
        color: COLORS.stylists[0],
        avatar: "👤",
      }
    )
  }

  const getServiceById = (id) => {
    return services.find((s) => s.id === id) || { id, name: "Unknown Service", duration: 30, price: 0 }
  }

  // Helper function to get upcoming leaves
  const getUpcomingLeaves = () => {
    const today = new Date()
    const localToday = formatDateToString(today)
    return leaves.filter((leave) => leave.date >= localToday)
  }

  // Helper function to handle leave selection for deletion
  const handleLeaveSelection = (leaveId) => {
    setSelectedLeavesToDelete((prev) => {
      if (prev.includes(leaveId)) {
        return prev.filter((id) => id !== leaveId)
      } else {
        return [...prev, leaveId]
      }
    })
  }

  // Helper function to handle bulk leave deletion
  const handleDeleteSelectedLeaves = async () => {
    if (selectedLeavesToDelete.length === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedLeavesToDelete.length} leave(s)?`)) return

    try {
      setLoading(true)

      for (const leaveId of selectedLeavesToDelete) {
        const leave = leaves.find(l => l.leave_id === leaveId)
        if (leave) {
          await ApiService.deleteLeave({
            stylist_id: leave.stylist_id,
            leave_id: leaveId
          })
        }
      }

      // Remove deleted leaves from state
      setLeaves(prev => prev.filter(leave => !selectedLeavesToDelete.includes(leave.leave_id)))
      setSelectedLeavesToDelete([])
      showNotification(`Successfully deleted ${selectedLeavesToDelete.length} leave(s)!`)
    } catch (error) {
      console.error("Error deleting leaves:", error)
      showNotification("Error deleting leaves. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e)
    const handleGlobalMouseUp = () => handleMouseUp()

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, dragStart])

  const selectedStylistsData = stylists.filter((s) => selectedStylists.includes(s.id))



  const renderDaySelectionView = () => (
    <DaySelectionView
      weekDates={weekDates}
      selectedLeaveDays={selectedLeaveDays}
      handleDayClick={handleDayClick}
    />
  );
  // Render calendar view










  
  const renderCalendarView = () => {
    if (selectedStylists.length === 0) {
      return (
        <div
          style={{
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              background: COLORS.cardBg,
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
            }}
          >
            <Users size={64} color={COLORS.textLight} style={{ marginBottom: "24px" }} />
            <h3 style={{ fontSize: "28px", fontWeight: "700", color: COLORS.text, marginBottom: "12px" }}>
              No Staff Selected
            </h3>
            <p style={{ fontSize: "16px", color: COLORS.textLight, lineHeight: "1.6" }}>
              Please select one or more staff members from the sidebar to view their schedules and manage appointments.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div style={{ padding: "24px" }}>
        <div
          ref={gridRef}
          style={{
            display: "flex",
            minHeight: "600px",
            background: COLORS.cardBg,
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            cursor: isDragging ? "grabbing" : "crosshair",
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Time Column */}
          <div
            style={{
              width: "80px",
              background: COLORS.sidebarBg,
              borderRight: `2px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                color: COLORS.text,
                background: "#edf2f7",
                borderBottom: `2px solid ${COLORS.border}`,
                fontSize: "12px",
              }}
            >
              <Clock size={16} />
            </div>
            <div
              style={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                color: COLORS.text,
                background: "#edf2f7",
                borderBottom: `2px solid ${COLORS.border}`,
                fontSize: "12px",
              }}
            >
              <User size={16} />
            </div>
            {hours.map((hour) => (
              <div
                key={hour}
                style={{
                  height: "64px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: "8px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: COLORS.textLight,
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {formatTime(hour)}
              </div>
            ))}
          </div>

          {/* Date Columns */}
          {weekDates.map((date, dateIndex) => (
            <div
              key={dateIndex}
              style={{
                flex: 1,
                minWidth: "200px",
                borderRight: `1px solid ${COLORS.border}`,
              }}
            >
              {/* Date Header */}
              <div
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${COLORS.info}, #3182ce)`,
                  color: "white",
                  fontWeight: "700",
                  borderBottom: `2px solid ${COLORS.border}`,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "20px", fontWeight: "800", display: "block" }}>{date.getDate()}</span>
                  <span style={{ fontSize: "11px", opacity: 0.9, fontWeight: "600" }}>
                    {date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Stylist Sub-headers */}
              <div
                style={{
                  display: "flex",
                  height: "50px",
                  borderBottom: `2px solid ${COLORS.border}`,
                }}
              >
                {selectedStylistsData.map((stylist) => {
                  const hasAnyLeave = hasLeaveOnDate(stylist.id, date)
                  return (
                    <div
                      key={stylist.id}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "4px 8px",
                        borderRight: `1px solid ${COLORS.border}`,
                        borderTop: `4px solid ${hasAnyLeave ? COLORS.leave : stylist.color}`,
                        fontSize: "11px",
                        fontWeight: "700",
                        background: hasAnyLeave ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: hasAnyLeave ? COLORS.leave : stylist.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          color: "white",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {hasAnyLeave ? <Plane size={12} /> : stylist.avatar}
                      </div>
                      <span style={{ color: COLORS.text }}>{stylist.name.split(" ")[0]}</span>
                    </div>
                  )
                })}
              </div>

              <div style={{ position: "relative", minHeight: "100%" }}>
                {/* Time slot grid */}
                {hours.map((hour, hourIndex) => (
                  <div
                    key={hourIndex}
                    style={{
                      display: "flex",
                      height: "64px",
                      borderBottom: `1px solid #f1f5f9`,
                    }}
                  >
                    {selectedStylistsData.map((stylist, stylistIndex) => {
                      return (
                        <div
                          key={`${hourIndex}-${stylist.id}`}
                          style={{
                            flex: 1,
                            borderRight: `1px solid #f1f5f9`,
                            transition: "background-color 0.2s ease",
                            position: "relative",
                          }}
                        >
                          {/* 15-minute subdivisions */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "grid",
                              gridTemplateRows: "repeat(4, 1fr)",
                            }}
                          >
                            {[0, 15, 30, 45].map((minute) => {
                              const minuteIsSelected = isSlotSelected(stylist.id, date, hour, minute)
                              const hasLeaveAtSlot = hasLeaveAtTimeSlot(stylist.id, date, hour, minute)
                              const isAvailable = isTimeSlotAvailable(stylist.id, date, hour, minute)

                              // Determine background color based on conditions
                              let backgroundColor = "transparent"
                              if (hasLeaveAtSlot) {
                                backgroundColor = "rgba(239, 68, 68, 0.3)" // Red for leaves
                              } else if (minuteIsSelected) {
                                backgroundColor = COLORS.selection // Selection color
                              } else if (!isAvailable) {
                                backgroundColor = "rgba(156, 163, 175, 0.2)" // Gray for unavailable times
                              }

                              return (
                                <div
                                  key={minute}
                                  style={{
                                    borderTop: minute === 0 ? "none" : "1px solid rgba(226, 232, 240, 0.5)",
                                    backgroundColor,
                                    opacity: minuteIsSelected ? 0.4 : !isAvailable ? 0.6 : 1,
                                    transition: "all 0.15s ease",
                                    position: "relative",
                                  }}
                                >
                                  {/* Leave indicator for specific time slot */}
                                  {hasLeaveAtSlot && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: COLORS.leave,
                                        fontSize: "8px",
                                        fontWeight: "600",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      <Plane size={8} />
                                    </div>
                                  )}
                                  {/* Unavailable time indicator */}
                                  {!isAvailable && !hasLeaveAtSlot && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "rgba(107, 114, 128, 0.7)",
                                        fontSize: "6px",
                                        fontWeight: "600",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      ✕
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* Appointments positioned absolutely */}
                {selectedStylistsData.map((stylist, stylistIndex) => {
                  const dayAppointments = getAppointmentsForDate(date, stylist.id)
                  const columnWidth = 100 / selectedStylists.length
                  const leftPosition = stylistIndex * columnWidth

                  return dayAppointments.map((appointment, aptIndex) => {
                    const position = calculateSlotPosition(appointment.startTime, appointment.endTime)
                    const statusColor =
                      appointment.status === "confirmed"
                        ? stylist.color
                        : appointment.status === "pending"
                          ? COLORS.warning
                          : appointment.status === "cancelled"
                            ? COLORS.danger
                            : stylist.color

                    return (
                      <div
                        key={`${appointment.id}-${aptIndex}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAppointmentClick(appointment)
                        }}
                        style={{
                          position: "absolute",
                          backgroundColor: statusColor,
                          top: `${position.top}px`,
                          height: `${Math.max(position.height, 32)}px`,
                          left: `${leftPosition}%`,
                          width: `${columnWidth - 1}%`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          overflow: "hidden",
                          zIndex: 10,
                          margin: "1px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.02)"
                          e.target.style.zIndex = "20"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)"
                          e.target.style.zIndex = "10"
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 10px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            color: "white",
                            textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "700",
                                fontSize: "12px",
                                flex: 1,
                                lineHeight: "1.2",
                              }}
                            >
                              {appointment.clientName}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              {appointment.isWalkIn ? <PersonStandingIcon size={14} /> : <Phone size={14} />}
                              {appointment.workstation && <MapPin size={12} />}
                            </div>
                          </div>
                          <div style={{ fontSize: "10px", fontWeight: "600", opacity: 0.9 }}>
                            <div>
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                            {appointment.workstation && (
                              <div style={{ fontSize: "9px", opacity: 0.8 }}>
                                {appointment.workstation.workstation_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }











  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
      }}
    >
      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: notification.type === "error" ? COLORS.danger : COLORS.success,
            color: "white",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: "600",
          }}
        >
          {notification.type === "error" ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
          {notification.message}
        </div>
      )}

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: COLORS.background,
          zIndex: 1,
        }}
      >
        {/* Enhanced Header with Filters */}
        <div
          style={{
            padding: "24px 32px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${COLORS.border}`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            flexShrink: 0,
          }}
        >
          {/* Title Section */}
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                }}
              >
                <Calendar size={28} color="white" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: COLORS.text,
                    marginBottom: "4px",
                    margin: 0,
                  }}
                >
                  Salon Scheduler
                </h1>
                <p style={{ fontSize: "15px", color: COLORS.textLight, margin: 0, fontWeight: "500" }}>
                  Unified scheduling system for appointments and staff schedules
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              {/* Date Range Navigation */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  background: COLORS.cardBg,
                  padding: "12px 20px",
                  borderRadius: "14px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                  border: `2px solid ${COLORS.border}`,
                }}
              >
                <button
                  onClick={() => navigateDateRange(-1)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.text,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = COLORS.hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none"
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <span
                  style={{
                    fontWeight: "700",
                    color: COLORS.text,
                    minWidth: "220px",
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  {weekDates.length > 0 &&
                    (maxDays === 1
                      ? formatDate(weekDates[0])
                      : `${formatDate(weekDates[0])} - ${formatDate(weekDates[weekDates.length - 1])}`)}
                </span>
                <button
                  onClick={() => navigateDateRange(1)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.text,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = COLORS.hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none"
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button
                onClick={() => {
                  setShowScheduleManagementPanel(true)
                  setSelectedLeavesToDelete([]) // Reset selection when opening
                }}
                style={{
                  padding: "14px 28px",
                  background: `linear-gradient(135deg, ${COLORS.warning}, #dd6b20)`,
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 6px 20px rgba(237, 137, 54, 0.3)",
                  fontSize: "14px",
                }}
              >
                <Settings size={18} />
                Manage Schedules
              </button>
              <button
                onClick={handleAddAppointment}
                style={{
                  padding: "14px 28px",
                  background: `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 6px 20px rgba(72, 187, 120, 0.3)",
                  fontSize: "14px",
                }}
              >
                <Plus size={18} />
                Add Appointment
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* View Period */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Filter size={18} color={COLORS.text} />
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, margin: 0 }}>View Period</h3>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {dayFilters.map((days) => (
                  <button
                    key={days}
                    onClick={() => setMaxDays(days)}
                    style={{
                      padding: "12px 16px",
                      background: maxDays === days ? `linear-gradient(135deg, ${COLORS.success}, #38a169)` : COLORS.cardBg,
                      border: `2px solid ${maxDays === days ? COLORS.success : COLORS.border}`,
                      borderRadius: "12px",
                      fontWeight: "600",
                      color: maxDays === days ? "white" : COLORS.text,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: maxDays === days ? "0 6px 20px rgba(72, 187, 120, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      fontSize: "14px",
                    }}
                  >
                    {days} Day{days !== 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Type Selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} color={COLORS.text} />
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, margin: 0 }}>Schedule Type</h3>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {scheduleTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.value}
                      onClick={() => {
                        setScheduleType(type.value)
                        setSelectedTimeSlots([])
                        setSelectedLeaveDays([])
                      }}
                      style={{
                        padding: "12px 16px",
                        background: scheduleType === type.value ? `linear-gradient(135deg, ${type.color}, #38a169)` : COLORS.cardBg,
                        border: `2px solid ${scheduleType === type.value ? type.color : COLORS.border}`,
                        borderRadius: "12px",
                        fontWeight: "600",
                        color: scheduleType === type.value ? "white" : COLORS.text,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: scheduleType === type.value ? `0 6px 20px ${type.color}50` : "0 2px 8px rgba(0, 0, 0, 0.1)",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IconComponent size={16} />
                      {type.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Staff Selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, minWidth: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={18} color={COLORS.text} />
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, margin: 0 }}>
                  Staff ({selectedStylists.length}/{stylists.filter((s) => s.isActive).length})
                </h3>
                <button
                  onClick={handleSelectAllStylists}
                  style={{
                    padding: "6px 12px",
                    background: COLORS.info,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {selectedStylists.length === stylists.filter((s) => s.isActive).length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {stylists.filter((s) => s.isActive).map((stylist) => (
                  <div
                    key={stylist.id}
                    onClick={() => handleStylistToggle(stylist.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: selectedStylists.includes(stylist.id) ? "white" : stylist.color,
                      backgroundColor: selectedStylists.includes(stylist.id) ? stylist.color : "rgba(255, 255, 255, 0.8)",
                      border: `2px solid ${stylist.color}`,
                      textShadow: selectedStylists.includes(stylist.id) ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "none",
                      boxShadow: selectedStylists.includes(stylist.id)
                        ? "0 3px 10px rgba(0, 0, 0, 0.2)"
                        : "0 2px 6px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: selectedStylists.includes(stylist.id) ? "translateY(-1px)" : "none",
                    }}
                  >
                    {stylist.name.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Fixed Layout */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: COLORS.background,
            zIndex: 1,
          }}
        >

          {/* Enhanced Calendar Controls */}
          <div
            style={{
              background: "#f8fafc",
              borderBottom: `1px solid ${COLORS.border}`,
              padding: "20px 32px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              {/* Selection Info */}
              {(selectedTimeSlots.length > 0 || selectedLeaveDays.length > 0) && (
                <div
                  style={{
                    background: "rgba(66, 153, 225, 0.1)",
                    border: "2px solid rgba(66, 153, 225, 0.2)",
                    borderRadius: "12px",
                    padding: "12px 20px",
                    boxShadow: "0 4px 15px rgba(66, 153, 225, 0.1)",
                  }}
                >
                  <span style={{ color: "#2c5282", fontSize: "15px", fontWeight: "700" }}>
                    {scheduleType === "leave"
                      ? `${selectedLeaveDays.length} days selected for leave`
                      : `${selectedTimeSlots.length} slots selected for ${scheduleType}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area - Embedded Calendar */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  minHeight: "400px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    border: `4px solid ${COLORS.border}`,
                    borderTop: `4px solid ${COLORS.info}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ fontSize: "16px", fontWeight: "600", color: COLORS.textLight }}>Loading...</p>
              </div>
            ) : scheduleType === "leave" ? (
              renderDaySelectionView()
            ) : (
              renderCalendarView()
            )}
          </div>
        </div>


        {/* Enhanced Add/Edit Appointment Panel */}
        <AddEditAppointmentPanel
          showAddAppointmentPanel={showAddAppointmentPanel}
          setShowAddAppointmentPanel={setShowAddAppointmentPanel}
          isEditingAppointment={isEditingAppointment}
          newAppointment={newAppointment}
          setNewAppointment={setNewAppointment}
          stylists={stylists}
          services={services}
          availableTimeSlots={availableTimeSlots}
          setAvailableTimeSlots={setAvailableTimeSlots}
          loading={loading}
          handleSaveAppointment={handleSaveAppointment}
          handleCheckAvailability={handleCheckAvailability}
          COLORS={COLORS}
        />



        {/* Enhanced Appointment Details Panel */}
        // In your SchedulingInterface component:
        {showAppointmentDetailsPanel && selectedAppointment && (
          <AppointmentDetailsPanel
            appointment={selectedAppointment}
            stylists={stylists}
            services={services}
            onComplete={() => handleCompleteAppointment(selectedAppointment.id)}
            onDelete={() => handleDeleteAppointment(selectedAppointment.id)}
            onClose={() => setShowAppointmentDetailsPanel(false)}
            loading={loading}
          />
        )}
        {/* Enhanced Schedule Management Panel */}
        import ScheduleManagementPanel from './ScheduleManagementPanel'

        // inside your component return:
        <ScheduleManagementPanel
          show={showScheduleManagementPanel}
          setShow={setShowScheduleManagementPanel}
          COLORS={COLORS}
          scheduleTypes={scheduleTypes}
          scheduleType={scheduleType}
          setScheduleType={setScheduleType}
          selectedTimeSlots={selectedTimeSlots}
          selectedLeaveDays={selectedLeaveDays}
          selectedLeavesToDelete={selectedLeavesToDelete}
          setSelectedLeavesToDelete={setSelectedLeavesToDelete}
          getUpcomingLeaves={getUpcomingLeaves}
          getStylistById={getStylistById}
          handleLeaveSelection={handleLeaveSelection}
          handleDeleteSelectedLeaves={handleDeleteSelectedLeaves}
          handleSaveSchedule={handleSaveSchedule}
          loading={loading}
        />


        {/* Global Styles */}
        <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
      </div>
    </div>
  )
}

export default SchedulingInterface