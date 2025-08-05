"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Save, Coffee, Plane, CheckCircle } from "lucide-react"
import API from "../../../../utils/api" // Assuming this path is correct

const ScheduleCalendar = ({ stylist, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState([])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([])
  const [selectedLeaveDays, setSelectedLeaveDays] = useState([])
  const [scheduleType, setScheduleType] = useState("available")
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [dragEnd, setDragEnd] = useState(null)
  const [selectionType, setSelectionType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [existingSchedules, setExistingSchedules] = useState([])
  const gridRef = useRef(null)

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const scheduleTypes = [
    { value: "available", label: "Available", icon: CheckCircle, color: "#10b981" }, // Green
    { value: "break", label: "Break", icon: Coffee, color: "#f59e0b" }, // Orange
    { value: "leave", label: "Leave", icon: Plane, color: "#ef4444" }, // Red
  ]

  // Styles object
  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    container: {
      width: "100%",
      maxWidth: "1200px",
      height: "90vh",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      animation: "slideIn 0.3s ease-out",
    },
    header: {
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "white",
      padding: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerInfo: {
      display: "flex",
      flexDirection: "column",
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "4px",
      margin: 0,
    },
    headerSubtitle: {
      fontSize: "14px",
      opacity: 0.9,
      margin: 0,
    },
    closeBtn: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "white",
      padding: "8px",
      borderRadius: "50%",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    controls: {
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
      padding: "20px 24px",
    },
    controlsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    weekNavigation: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      background: "white",
      padding: "8px 16px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    navBtn: {
      background: "none",
      border: "none",
      padding: "8px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    weekDisplay: {
      fontWeight: "600",
      color: "#2d3748",
      minWidth: "200px",
      textAlign: "center",
    },
    saveBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "linear-gradient(135deg, #48bb78, #38a169)",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(72, 187, 120, 0.3)",
    },
    saveBtnDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    scheduleTypes: {
      display: "flex",
      gap: "12px",
      marginBottom: "16px",
    },
    typeBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      border: "2px solid",
      borderRadius: "8px",
      background: "white",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    instructions: {
      background: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.2)",
      borderRadius: "8px",
      padding: "12px 16px",
      marginBottom: "12px",
    },
    instructionsText: {
      color: "#1e40af",
      fontSize: "14px",
      margin: 0,
    },
    selectionPreview: {
      background: "rgba(66, 153, 225, 0.1)",
      border: "1px solid rgba(66, 153, 225, 0.2)",
      borderRadius: "8px",
      padding: "12px 16px",
    },
    selectionText: {
      color: "#2c5282",
      fontSize: "14px",
      margin: 0,
    },
    leaveCalendar: {
      flex: 1,
      padding: "24px",
      background: "#f8fafc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    leaveDaysGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "16px",
      maxWidth: "800px",
      width: "100%",
    },
    leaveDay: {
      background: "white",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    leaveDaySelected: {
      background: "rgba(239, 68, 68, 0.1)",
      borderColor: "#ef4444",
      color: "#dc2626",
    },
    dayHeader: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    dayName: {
      fontSize: "12px",
      fontWeight: "500",
      color: "#718096",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    dayNameSelected: {
      color: "#dc2626",
    },
    dayNumber: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#2d3748",
    },
    dayNumberSelected: {
      color: "#dc2626",
    },
    dayMonth: {
      fontSize: "11px",
      color: "#a0aec0",
      fontWeight: "500",
    },
    dayMonthSelected: {
      color: "#dc2626",
    },
    leaveIndicator: {
      position: "absolute",
      top: "8px",
      right: "8px",
      color: "#ef4444",
      animation: "bounce 2s infinite",
    },
    calendarContainer: {
      flex: 1,
      overflow: "auto",
      background: "white",
    },
    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "70px repeat(7, 1fr)",
      minWidth: "800px",
      userSelect: "none",
      gap: 0,
    },
    timeHeader: {
      background: "#f7fafc",
      borderBottom: "2px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      color: "#4a5568",
      fontSize: "14px",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    dateHeader: {
      background: "#f7fafc",
      borderBottom: "2px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    dateInfo: {
      textAlign: "center",
    },
    dateDay: {
      fontSize: "12px",
      color: "#718096",
      display: "block",
    },
    dateNumber: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2d3748",
    },
    timeSlot: {
      background: "#f7fafc",
      borderBottom: "1px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      color: "#4a5568",
      fontSize: "14px",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    calendarCell: {
      height: "60px",
      borderBottom: "1px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      position: "relative",
      cursor: "crosshair",
      transition: "all 0.2s ease",
      background: "white", // Default background for the hour cell
    },
    minuteSubdivisions: {
      position: "absolute",
      inset: 0,
      display: "grid",
      gridTemplateRows: "repeat(4, 1fr)",
    },
    minuteSlot: {
      borderTop: "1px solid rgba(226, 232, 240, 0.5)",
      transition: "all 0.15s ease",
      backgroundColor: "transparent", // Default for 15-min slot
    },
    minuteSlotFirst: {
      borderTop: "none",
    },
    existingIndicator: {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "8px",
      height: "8px",
      background: "currentColor",
      borderRadius: "50%",
      opacity: 1, // Changed to solid
    },
  }

  const fetchExistingSchedules = useCallback(async () => {
    try {
      const response = await API.get(`/salon-admin/schedule/stylists/${stylist?.stylist_id}`)
      const scheduleData = response.data?.data || response.data || []

      // Only update state if data has actually changed
      setExistingSchedules((prev) => {
        const newData = scheduleData["schedule"] || []
        return JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData
      })
    } catch (error) {
      console.error("Error fetching schedules:", error)
    }
  }, [stylist?.stylist_id]) // Add dependencies here

  useEffect(() => {
    generateWeekDates()
    fetchExistingSchedules()
  }, [selectedDate]) // Removed fetchExistingSchedules from dependency array

  const generateWeekDates = () => {
    const startOfWeek = new Date(selectedDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    setWeekDates(dates)
  }

  const getCellPosition = (e) => {
    if (!gridRef.current) return null
    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const headerHeight = 50
    const timeColumnWidth = 70
    if (y < headerHeight || x < timeColumnWidth) return null
    const cellWidth = (rect.width - timeColumnWidth) / 7
    const cellHeight = 60
    const dayIndex = Math.floor((x - timeColumnWidth) / cellWidth)
    const hourIndex = Math.floor((y - headerHeight) / cellHeight)
    const minuteInHour = Math.floor((((y - headerHeight) % cellHeight) / cellHeight) * 60)
    const minute = Math.floor(minuteInHour / 15) * 15
    if (dayIndex < 0 || dayIndex >= 7 || hourIndex < 0 || hourIndex >= 24) {
      return null
    }
    return {
      dayIndex,
      hourIndex,
      minute,
      date: weekDates[dayIndex],
    }
  }

  const determineSelectionType = (start, end) => {
    const dayDiff = Math.abs(end.dayIndex - start.dayIndex)
    const hourDiff = Math.abs(end.hourIndex - start.hourIndex)
    const minuteDiff = Math.abs(end.minute - start.minute)
    if (dayDiff > 0 && hourDiff === 0 && minuteDiff === 0) {
      return "horizontal"
    } else if (dayDiff === 0 && (hourDiff > 0 || minuteDiff > 0)) {
      return "vertical"
    } else if (dayDiff > 0 && (hourDiff > 0 || minuteDiff > 0)) {
      return "diagonal"
    }
    return "single"
  }

  const handleMouseDown = (e) => {
    if (scheduleType === "leave") return // No dragging for leave
    const position = getCellPosition(e)
    if (!position) return
    setIsDragging(true)
    setDragStart(position)
    setDragEnd(position)
    setSelectedTimeSlots([])
    setSelectionType(null)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart || scheduleType === "leave") return
    const position = getCellPosition(e)
    if (!position) return
    setDragEnd(position)
    const type = determineSelectionType(dragStart, position)
    setSelectionType(type)
    updateSelection(dragStart, position, type)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDayClick = (date) => {
    if (scheduleType !== "leave") return
    const dateStr = date.toISOString().split("T")[0]
    setSelectedLeaveDays((prev) => {
      if (prev.includes(dateStr)) {
        return prev.filter((d) => d !== dateStr)
      } else {
        return [...prev, dateStr]
      }
    })
  }

  const updateSelection = (start, end, type) => {
    const slots = new Set() // Use a Set to avoid duplicate slot IDs
    const minDay = Math.min(start.dayIndex, end.dayIndex)
    const maxDay = Math.max(start.dayIndex, end.dayIndex)
    const minHour = Math.min(start.hourIndex, end.hourIndex)
    const maxHour = Math.max(start.hourIndex, end.hourIndex)
    const minMinute = Math.min(start.minute, end.minute)
    const maxMinute = Math.max(start.minute, end.minute)

    for (let dayIdx = minDay; dayIdx <= maxDay; dayIdx++) {
      for (let hourIdx = minHour; hourIdx <= maxHour; hourIdx++) {
        for (let minute = 0; minute < 60; minute += 15) {
          // Only add if within the selected minute range for the start/end hours
          if ((hourIdx === minHour && minute < minMinute) || (hourIdx === maxHour && minute > maxMinute)) {
            continue
          }
          const slotId = `${weekDates[dayIdx]?.toISOString().split("T")[0]}-${hourIdx}-${minute}`
          slots.add(slotId)
        }
      }
    }
    setSelectedTimeSlots(Array.from(slots))
  }

  const formatTime = (hour, minute = 0) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  }

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      // Check if date is not a Date object or is an invalid Date
      return "Invalid Date" // Or return an empty string, or handle as appropriate
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const isSlotSelected = (date, hour, minute = 0) => {
    const slotId = `${date.toISOString().split("T")[0]}-${hour}-${minute}`
    return selectedTimeSlots.includes(slotId)
  }

  const isDaySelectedForLeave = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return selectedLeaveDays.includes(dateStr)
  }

  const hasExistingSchedule = (date, hour, minute = 0) => {
    // Safely handle existingSchedules - ensure it's an array
    const schedules = Array.isArray(existingSchedules) ? existingSchedules : []
    if (schedules.length === 0) return false

    // Get day of week for the date we're checking (0-6, Sunday-Saturday)
    const dayOfWeek = date.getDay()

    // Convert current time to minutes for comparison
    const currentTotalMinutes = hour * 60 + minute

    // Check each schedule to see if it applies to this day/time
    return schedules.some((schedule) => {
      try {
        // Skip if this schedule is for a different day of week
        if (schedule.day_of_week !== dayOfWeek) return false

        // Parse the schedule's start and end times
        const [startHour, startMinute] = schedule.start_time_daily.split(":").map(Number)
        const [endHour, endMinute] = schedule.end_time_daily.split(":").map(Number)

        const startTotalMinutes = startHour * 60 + startMinute
        const endTotalMinutes = endHour * 60 + endMinute

        // Handle overnight schedules (end time is next day)
        if (endTotalMinutes < startTotalMinutes) {
          return currentTotalMinutes >= startTotalMinutes || currentTotalMinutes < endTotalMinutes
        }

        // Normal same-day schedule
        return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes
      } catch (error) {
        console.error("Error processing schedule:", schedule, error)
        return false
      }
    })
  }

  // Helper: Check if any part of the hour has an existing schedule
  const hasAnyExistingScheduleInHour = (date, hour) => {
    const schedules = Array.isArray(existingSchedules) ? existingSchedules : []
    if (schedules.length === 0) return false

    const dayOfWeek = date.getDay()
    const hourStartMinutes = hour * 60
    const hourEndMinutes = (hour + 1) * 60

    return schedules.some((schedule) => {
      try {
        if (schedule.day_of_week !== dayOfWeek) return false

        const [startHour, startMinute] = schedule.start_time_daily.split(":").map(Number)
        const [endHour, endMinute] = schedule.end_time_daily.split(":").map(Number)

        const scheduleStartTotalMinutes = startHour * 60 + startMinute
        const scheduleEndTotalMinutes = endHour * 60 + endMinute

        // Adjust for overnight schedules to simplify overlap check
        if (scheduleEndTotalMinutes < scheduleStartTotalMinutes) {
          // If schedule spans midnight, consider it as two segments for overlap check:
          // 1. From start to end of day (24*60)
          // 2. From start of day (0) to end
          return (
            (scheduleStartTotalMinutes < hourEndMinutes && 24 * 60 > hourStartMinutes) ||
            (0 < hourEndMinutes && scheduleEndTotalMinutes > hourStartMinutes)
          )
        }

        // Normal same-day schedule overlap check
        return scheduleStartTotalMinutes < hourEndMinutes && scheduleEndTotalMinutes > hourStartMinutes
      } catch (error) {
        console.error("Error processing schedule for hour check:", schedule, error)
        return false
      }
    })
  }

  // Simplified getCellColor - it only provides default styling for the hour cell
  const getCellColor = () => {
    return {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderWidth: "1px",
    }
  }

  // Helper: Get day of week from date (0 = Sunday)
  const getDayOfWeek = (date) => {
    return new Date(date).getDay()
  }

  const handleSaveSchedule = async () => {
    setLoading(true)
    try {
      if (!stylist?.stylist_id) {
        alert("Stylist not selected.")
        return
      }
      if (scheduleType === "leave") {
        const scheduleData = selectedLeaveDays.map((dateStr) => ({
          stylist_id: stylist.stylist_id,
          start_datetime: new Date(`${dateStr}T00:00:00.000Z`).toISOString(),
          end_datetime: new Date(`${dateStr}T23:59:59.999Z`).toISOString(),
          schedule_type: scheduleType,
        }))
        await API.post("/salon-admin/stylist/schedule", scheduleData)
        alert(`Leave saved! ${selectedLeaveDays.length} day(s) marked for leave.`)
        setSelectedLeaveDays([])
      } else {
        if (selectedTimeSlots.length === 0) {
          alert("Please select a time range.")
          return
        }
        // Group selected slots by day of week and consolidate into ranges
        const slotsByDay = selectedTimeSlots.reduce((acc, slotId) => {
          const [dateStr, hour, minute] = slotId.split("-")
          const date = new Date(dateStr)
          const dayOfWeek = date.getDay()
          if (!acc[dayOfWeek]) {
            acc[dayOfWeek] = []
          }
          acc[dayOfWeek].push(Number.parseInt(hour) * 60 + Number.parseInt(minute))
          return acc
        }, {})

        for (const dayOfWeek in slotsByDay) {
          const minutes = slotsByDay[dayOfWeek].sort((a, b) => a - b)

          // Consolidate contiguous 15-minute slots into larger ranges
          let currentRangeStart = minutes[0]
          let currentRangeEnd = minutes[0] + 15 // End of the first 15-min slot
          const consolidatedRanges = []

          for (let i = 1; i < minutes.length; i++) {
            if (minutes[i] === currentRangeEnd) {
              currentRangeEnd += 15
            } else {
              consolidatedRanges.push({ start: currentRangeStart, end: currentRangeEnd })
              currentRangeStart = minutes[i]
              currentRangeEnd = minutes[i] + 15
            }
          }
          consolidatedRanges.push({ start: currentRangeStart, end: currentRangeEnd }) // Add the last range

          for (const range of consolidatedRanges) {
            const startTime = `${String(Math.floor(range.start / 60)).padStart(2, "0")}:${String(range.start % 60).padStart(2, "0")}`
            const endTime = `${String(Math.floor(range.end / 60)).padStart(2, "0")}:${String(range.end % 60).padStart(2, "0")}`

            await API.post(`/salon-admin/schedule/stylists/${stylist.stylist_id}`, {
              day_of_week: Number.parseInt(dayOfWeek),
              start_time_daily: startTime,
              end_time_daily: endTime,
            })
          }
        }
        alert(`Schedule saved! ${selectedTimeSlots.length} slots processed.`)
        setSelectedTimeSlots([])
      }
      await fetchExistingSchedules()
    } catch (error) {
      console.error("Error saving schedule:", error)
      alert("Error saving schedule. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setSelectedDate(newDate)
    setSelectedTimeSlots([]) // Clear selection when navigating weeks
    setSelectedLeaveDays([]) // Also clear leave days selection for consistency
  }

  const getSelectionPreview = () => {
    if (scheduleType === "leave") {
      if (selectedLeaveDays.length === 0) return null
      return `${selectedLeaveDays.length} day${selectedLeaveDays.length !== 1 ? "s" : ""} selected for leave`
    }
    if (selectedTimeSlots.length === 0) return null

    const datesInSelection = new Set()
    let minTotalMinutes = 24 * 60 // Max possible minutes
    let maxTotalMinutes = -1 // Min possible minutes

    selectedTimeSlots.forEach((slotId) => {
      const [dateStr, hourStr, minuteStr] = slotId.split("-")
      datesInSelection.add(dateStr)
      const totalMinutes = Number.parseInt(hourStr) * 60 + Number.parseInt(minuteStr)

      minTotalMinutes = Math.min(minTotalMinutes, totalMinutes)
      maxTotalMinutes = Math.max(maxTotalMinutes, totalMinutes)
    })

    const formattedStartTime = formatTime(Math.floor(minTotalMinutes / 60), minTotalMinutes % 60)
    const formattedEndTime = formatTime(Math.floor((maxTotalMinutes + 15) / 60), (maxTotalMinutes + 15) % 60) // End of the last selected 15-min slot

    const numDays = datesInSelection.size

    if (numDays === 1) {
      const selectedDateObj = weekDates.find((d) => d.toISOString().split("T")[0] === Array.from(datesInSelection)[0])
      return `${formatDate(selectedDateObj)}: ${formattedStartTime} - ${formattedEndTime}`
    } else {
      return `${numDays} days, ${formattedStartTime} - ${formattedEndTime}`
    }
  }

  const handleScheduleTypeChange = (type) => {
    setScheduleType(type)
    setSelectedTimeSlots([])
    setSelectedLeaveDays([])
  }

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
  }, [isDragging, dragStart]) // Removed handleMouseMove from dependency array

  if (!stylist) {
    return null
  }

  const totalSelections = scheduleType === "leave" ? selectedLeaveDays.length : selectedTimeSlots.length

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <h2 style={styles.headerTitle}>Schedule Management</h2>
            <p style={styles.headerSubtitle}>Managing schedule for {stylist.stylist_name}</p>
          </div>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)"
              e.target.style.transform = "scale(1.1)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)"
              e.target.style.transform = "scale(1)"
            }}
          >
            <X size={20} />
          </button>
        </div>
        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.controlsRow}>
            {/* Week Navigation */}
            <div style={styles.weekNavigation}>
              <button
                onClick={() => navigateWeek(-1)}
                style={styles.navBtn}
                onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
              >
                <ChevronLeft size={18} />
              </button>
              <span style={styles.weekDisplay}>
                {weekDates.length > 0 && `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`}
              </span>
              <button
                onClick={() => navigateWeek(1)}
                style={styles.navBtn}
                onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
                onMouseLeave={(e) => (e.target.style.background = "none")}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            {/* Save Button */}
            <button
              onClick={handleSaveSchedule}
              disabled={loading || totalSelections === 0}
              style={{
                ...styles.saveBtn,
                ...(loading || totalSelections === 0 ? styles.saveBtnDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading && totalSelections > 0) {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 20px rgba(72, 187, 120, 0.4)"
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && totalSelections > 0) {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(72, 187, 120, 0.3)"
                }
              }}
            >
              <Save size={16} />
              {loading ? "Saving..." : `Save ${totalSelections > 0 ? `(${totalSelections})` : ""}`}
            </button>
          </div>
          {/* Schedule Type Selection */}
          <div style={styles.scheduleTypes}>
            {scheduleTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  onClick={() => handleScheduleTypeChange(type.value)}
                  style={{
                    ...styles.typeBtn,
                    backgroundColor: scheduleType === type.value ? type.color + "20" : "transparent",
                    borderColor: scheduleType === type.value ? type.color : "#e2e8f0",
                    color: scheduleType === type.value ? type.color : "#718096",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)"
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "none"
                  }}
                >
                  <Icon size={14} />
                  {type.label}
                </button>
              )
            })}
          </div>
          {/* Instructions */}
          <div className="flex justify-between items-center mb-4">
            <div style={styles.instructions}>
              <p style={styles.instructionsText}>
                {scheduleType === "leave"
                  ? "💡 Click on days to select/deselect them for leave"
                  : "💡 Drag horizontally for same time across days, vertically for time ranges on same day"}
              </p>
            </div>
            {/* Selection Preview */}
            {(isDragging || totalSelections > 0) && (
              <div style={styles.selectionPreview}>
                <p style={styles.selectionText}>
                  <strong>Selection:</strong> {getSelectionPreview() || `${totalSelections} selected`}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Calendar Content */}
        {scheduleType === "leave" ? (
          /* Simple Day Calendar for Leave */
          <div style={styles.leaveCalendar}>
            <div style={styles.leaveDaysGrid}>
              {weekDates.map((date, index) => {
                const isSelected = isDaySelectedForLeave(date)
                return (
                  <div
                    key={index}
                    style={{
                      ...styles.leaveDay,
                      ...(isSelected ? styles.leaveDaySelected : {}),
                    }}
                    onClick={() => handleDayClick(date)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = "#cbd5e0"
                        e.target.style.transform = "translateY(-2px)"
                        e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.borderColor = "#e2e8f0"
                        e.target.style.transform = "translateY(0)"
                        e.target.style.boxShadow = "none"
                      }
                    }}
                  >
                    <div style={styles.dayHeader}>
                      <span
                        style={{
                          ...styles.dayName,
                          ...(isSelected ? styles.dayNameSelected : {}),
                        }}
                      >
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span
                        style={{
                          ...styles.dayNumber,
                          ...(isSelected ? styles.dayNumberSelected : {}),
                        }}
                      >
                        {date.getDate()}
                      </span>
                    </div>
                    <div
                      style={{
                        ...styles.dayMonth,
                        ...(isSelected ? styles.dayMonthSelected : {}),
                      }}
                    >
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    {isSelected && (
                      <div style={styles.leaveIndicator}>
                        <Plane size={20} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Full Calendar Grid for Available/Break */
          <div style={styles.calendarContainer}>
            <div
              ref={gridRef}
              style={{
                ...styles.calendarGrid,
                cursor: isDragging ? "grabbing" : "crosshair",
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Headers Row */}
              <div style={styles.timeHeader}>Time</div>
              {weekDates.map((date, index) => (
                <div key={`header-${index}`} style={styles.dateHeader}>
                  <div style={styles.dateInfo}>
                    <span style={styles.dateDay}>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span style={styles.dateNumber}>{date.getDate()}</span>
                  </div>
                </div>
              ))}
              {/* Time Rows */}
              {hours.flatMap((hour) => [
                /* Time Label */
                <div key={`time-${hour}`} style={styles.timeSlot}>
                  {formatTime(hour)}
                </div>,
                /* Time Slots for Each Day */
                ...weekDates.map((date, dateIndex) => {
                  const cellStyle = getCellColor() // Simplified to only return default
                  return (
                    <div
                      key={`cell-${dateIndex}-${hour}`}
                      style={{
                        ...styles.calendarCell,
                        ...cellStyle,
                      }}
                    >
                      {/* 15-minute subdivisions */}
                      <div style={styles.minuteSubdivisions}>
                        {[0, 15, 30, 45].map((minute) => {
                          const minuteHasSchedule = hasExistingSchedule(date, hour, minute)
                          const minuteIsSelected = isSlotSelected(date, hour, minute)

                          let minuteSlotBgColor = styles.minuteSlot.backgroundColor // Default transparent
                          let minuteSlotBorderLeft = "none"

                          // Apply existing schedule color first
                          if (minuteHasSchedule) {
                            minuteSlotBgColor = scheduleTypes.find((t) => t.value === "leave").color // Solid red for existing
                            minuteSlotBorderLeft = `3px solid ${scheduleTypes.find((t) => t.value === "leave").color}`
                          }
                          // Apply selected color, overriding existing if both are true
                          if (minuteIsSelected) {
                            const currentType = scheduleTypes.find((t) => t.value === scheduleType)
                            minuteSlotBgColor = currentType.color // Solid color based on selected type
                            minuteSlotBorderLeft = `3px solid ${currentType.color}`
                          }

                          return (
                            <div
                              key={minute}
                              style={{
                                ...styles.minuteSlot,
                                ...(minute === 0 ? styles.minuteSlotFirst : {}),
                                backgroundColor: minuteSlotBgColor,
                                borderLeft: minuteSlotBorderLeft,
                              }}
                            />
                          )
                        })}
                      </div>
                      {/* Existing schedule indicator */}
                      {hasAnyExistingScheduleInHour(date, hour) && <div style={styles.existingIndicator} />}
                    </div>
                  )
                }),
              ])}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleCalendar
