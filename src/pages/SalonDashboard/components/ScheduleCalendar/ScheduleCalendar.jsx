"use client"

import { useState, useEffect, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Save, Coffee, Plane, CheckCircle } from "lucide-react"

// Mock API for demonstration
const mockAPI = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes("/schedules")) {
          resolve({
            data: [
              {
                schedule_id: 1,
                stylist_id: 1,
                start_datetime: "2024-02-05T09:00:00.000Z",
                end_datetime: "2024-02-05T17:00:00.000Z",
                schedule_type: "available",
              },
              {
                schedule_id: 2,
                stylist_id: 1,
                start_datetime: "2024-02-05T12:00:00.000Z",
                end_datetime: "2024-02-05T13:00:00.000Z",
                schedule_type: "break",
              },
            ],
          })
        }
      }, 500)
    })
  },
  post: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Saving schedule:", data)
        resolve({ data: { success: true } })
      }, 1000)
    })
  },
}

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
    { value: "available", label: "Available", icon: CheckCircle, color: "#10b981" },
    { value: "break", label: "Break", icon: Coffee, color: "#f59e0b" },
    { value: "leave", label: "Leave", icon: Plane, color: "#ef4444" },
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
      height: "60px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: "8px",
      fontSize: "12px",
      fontWeight: "500",
      color: "#718096",
      position: "sticky",
      left: 0,
      zIndex: 5,
    },
    calendarCell: {
      height: "60px",
      borderBottom: "1px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      position: "relative",
      cursor: "crosshair",
      transition: "all 0.2s ease",
      background: "white",
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
    },
    minuteSlotFirst: {
      borderTop: "none",
    },
    minuteSlotSelected: {
      backgroundColor: "rgba(66, 153, 225, 0.2)",
    },
    existingIndicator: {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "8px",
      height: "8px",
      background: "currentColor",
      borderRadius: "50%",
      opacity: 0.6,
    },
  }

  useEffect(() => {
    generateWeekDates()
    fetchExistingSchedules()
  }, [selectedDate])

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

  const fetchExistingSchedules = async () => {
    try {
      const response = await mockAPI.get(`/salon-admin/stylist/${stylist?.stylist_id}/schedules`)
      setExistingSchedules(response.data || [])
    } catch (error) {
      console.error("Error fetching schedules:", error)
    }
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
    const slots = []

    switch (type) {
      case "horizontal":
        const startDay = Math.min(start.dayIndex, end.dayIndex)
        const endDay = Math.max(start.dayIndex, end.dayIndex)

        for (let dayIdx = startDay; dayIdx <= endDay; dayIdx++) {
          const slotId = `${weekDates[dayIdx]?.toISOString().split("T")[0]}-${start.hourIndex}-${start.minute}`
          slots.push(slotId)
        }
        break

      case "vertical":
        const startTime = start.hourIndex * 60 + start.minute
        const endTime = end.hourIndex * 60 + end.minute
        const minTime = Math.min(startTime, endTime)
        const maxTime = Math.max(startTime, endTime)

        for (let totalMinutes = minTime; totalMinutes <= maxTime; totalMinutes += 15) {
          const hour = Math.floor(totalMinutes / 60)
          const minute = totalMinutes % 60
          const slotId = `${weekDates[start.dayIndex]?.toISOString().split("T")[0]}-${hour}-${minute}`
          slots.push(slotId)
        }
        break

      case "diagonal":
        const minDay = Math.min(start.dayIndex, end.dayIndex)
        const maxDay = Math.max(start.dayIndex, end.dayIndex)
        const minTimeD = Math.min(start.hourIndex * 60 + start.minute, end.hourIndex * 60 + end.minute)
        const maxTimeD = Math.max(start.hourIndex * 60 + start.minute, end.hourIndex * 60 + end.minute)

        for (let dayIdx = minDay; dayIdx <= maxDay; dayIdx++) {
          for (let totalMinutes = minTimeD; totalMinutes <= maxTimeD; totalMinutes += 15) {
            const hour = Math.floor(totalMinutes / 60)
            const minute = totalMinutes % 60
            const slotId = `${weekDates[dayIdx]?.toISOString().split("T")[0]}-${hour}-${minute}`
            slots.push(slotId)
          }
        }
        break

      case "single":
      default:
        const slotId = `${weekDates[start.dayIndex]?.toISOString().split("T")[0]}-${start.hourIndex}-${start.minute}`
        slots.push(slotId)
        break
    }

    setSelectedTimeSlots(slots)
  }

  const formatTime = (hour, minute = 0) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  }

  const formatDate = (date) => {
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

  const getExistingScheduleType = (date, hour) => {
    const existing = existingSchedules.find((schedule) => {
      const scheduleDate = new Date(schedule.start_datetime).toISOString().split("T")[0]
      const scheduleHour = new Date(schedule.start_datetime).getHours()
      const scheduleEndHour = new Date(schedule.end_datetime).getHours()
      const currentDate = date.toISOString().split("T")[0]

      return scheduleDate === currentDate && scheduleHour <= hour && scheduleEndHour > hour
    })
    return existing?.schedule_type || null
  }

  const getCellColor = (date, hour, minute = 0) => {
    const isSelected = isSlotSelected(date, hour, minute)
    const existingType = getExistingScheduleType(date, hour)

    if (isSelected) {
      const currentType = scheduleTypes.find((t) => t.value === scheduleType)
      return {
        backgroundColor: currentType.color + "40",
        borderColor: currentType.color,
        borderWidth: "2px",
      }
    }

    if (existingType) {
      const type = scheduleTypes.find((t) => t.value === existingType)
      return {
        backgroundColor: type.color + "20",
        borderColor: type.color + "60",
        borderWidth: "1px",
      }
    }

    return {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderWidth: "1px",
    }
  }

  const handleSaveSchedule = async () => {
    setLoading(true)

    try {
      let scheduleData = []

      if (scheduleType === "leave") {
        // Handle leave days
        scheduleData = selectedLeaveDays.map((dateStr) => ({
          stylist_id: stylist.stylist_id,
          start_datetime: new Date(`${dateStr}T00:00:00.000Z`).toISOString(),
          end_datetime: new Date(`${dateStr}T23:59:59.999Z`).toISOString(),
          schedule_type: scheduleType,
        }))
      } else {
        // Handle time slots
        scheduleData = selectedTimeSlots.map((slotId) => {
          const [dateStr, hourStr, minuteStr] = slotId.split("-")
          const startDateTime = new Date(`${dateStr}T${hourStr.padStart(2, "0")}:${minuteStr.padStart(2, "0")}:00.000Z`)
          const endDateTime = new Date(startDateTime)
          endDateTime.setMinutes(endDateTime.getMinutes() + 15)

          return {
            stylist_id: stylist.stylist_id,
            start_datetime: startDateTime.toISOString(),
            end_datetime: endDateTime.toISOString(),
            schedule_type: scheduleType,
          }
        })
      }

      await mockAPI.post("/salon-admin/stylist/schedule", scheduleData)

      const count = scheduleType === "leave" ? selectedLeaveDays.length : selectedTimeSlots.length
      const unit = scheduleType === "leave" ? "days" : "time slots"
      alert(`Schedule saved! ${count} ${unit} selected for ${scheduleType}`)

      setSelectedTimeSlots([])
      setSelectedLeaveDays([])
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
  }

  const getSelectionPreview = () => {
    if (scheduleType === "leave") {
      if (selectedLeaveDays.length === 0) return null
      return `${selectedLeaveDays.length} day${selectedLeaveDays.length !== 1 ? "s" : ""} selected for leave`
    }

    if (!dragStart || !dragEnd || !selectionType) return null

    const startDay = Math.min(dragStart.dayIndex, dragEnd.dayIndex)
    const endDay = Math.max(dragStart.dayIndex, dragEnd.dayIndex)
    const startTime = Math.min(dragStart.hourIndex * 60 + dragStart.minute, dragEnd.hourIndex * 60 + dragEnd.minute)
    const endTime = Math.max(dragStart.hourIndex * 60 + dragStart.minute, dragEnd.hourIndex * 60 + dragEnd.minute)

    switch (selectionType) {
      case "horizontal":
        return `${formatTime(dragStart.hourIndex, dragStart.minute)} across ${endDay - startDay + 1} days`
      case "vertical":
        return `${formatDate(weekDates[startDay])}: ${formatTime(Math.floor(startTime / 60), startTime % 60)} - ${formatTime(Math.floor(endTime / 60), endTime % 60)}`
      case "diagonal":
        return `${endDay - startDay + 1} days, ${formatTime(Math.floor(startTime / 60), startTime % 60)} - ${formatTime(Math.floor(endTime / 60), endTime % 60)}`
      case "single":
        return `${formatDate(weekDates[startDay])}: ${formatTime(dragStart.hourIndex, dragStart.minute)}`
      default:
        return null
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
  }, [isDragging, dragStart])

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
                  const cellStyle = getCellColor(date, hour)
                  return (
                    <div
                      key={`cell-${dateIndex}-${hour}`}
                      style={{
                        ...styles.calendarCell,
                        ...cellStyle,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSlotSelected(date, hour)) {
                          e.target.style.backgroundColor = "rgba(66, 153, 225, 0.05)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSlotSelected(date, hour)) {
                          e.target.style.backgroundColor = cellStyle.backgroundColor
                        }
                      }}
                    >
                      {/* 15-minute subdivisions */}
                      <div style={styles.minuteSubdivisions}>
                        {[0, 15, 30, 45].map((minute) => (
                          <div
                            key={minute}
                            style={{
                              ...styles.minuteSlot,
                              ...(minute === 0 ? styles.minuteSlotFirst : {}),
                              ...(isSlotSelected(date, hour, minute) ? styles.minuteSlotSelected : {}),
                            }}
                          />
                        ))}
                      </div>

                      {/* Existing schedule indicator */}
                      {getExistingScheduleType(date, hour) && <div style={styles.existingIndicator} />}
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
