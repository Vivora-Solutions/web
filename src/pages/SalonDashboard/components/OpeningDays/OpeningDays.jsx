"use client"

import { useState, useEffect } from "react"
import API from "../../../../utils/api"

const OpeningHours = () => {
  const [openingHours, setOpeningHours] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const daysOfWeek = [
    { name: "Sunday", short: "Sun" },
    { name: "Monday", short: "Mon" },
    { name: "Tuesday", short: "Tue" },
    { name: "Wednesday", short: "Wed" },
    { name: "Thursday", short: "Thu" },
    { name: "Friday", short: "Fri" },
    { name: "Saturday", short: "Sat" },
  ]

  useEffect(() => {
    const fetchOpeningHours = async () => {
      setIsLoading(true)
      try {
        const response = await API.get("/salon-admin/opening-hours")
        const days = response.data.days || []
        const completeDays = Array(7)
          .fill()
          .map((_, index) => {
            const existingDay = days.find((d) => d.day_of_week === index)
            return (
              existingDay || {
                day_of_week: index,
                is_open: false,
                opening_time: null,
                closing_time: null,
              }
            )
          })
        setOpeningHours(completeDays)
      } catch (error) {
        console.error("Error fetching opening hours:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpeningHours()
  }, [])

  const handleToggleOpen = (index) => {
    const updatedHours = [...openingHours]
    updatedHours[index].is_open = !updatedHours[index].is_open

    if (!updatedHours[index].is_open) {
      updatedHours[index].opening_time = null
      updatedHours[index].closing_time = null
    } else {
      updatedHours[index].opening_time = updatedHours[index].opening_time || "10:00:00"
      updatedHours[index].closing_time = updatedHours[index].closing_time || "17:00:00"
    }

    setOpeningHours(updatedHours)
  }

  const handleTimeChange = (index, field, value) => {
    const updatedHours = [...openingHours]
    const formattedValue = value ? `${value}:00` : null
    updatedHours[index][field] = formattedValue
    setOpeningHours(updatedHours)
  }

  const formatTimeForDisplay = (time) => {
    if (!time) return "Closed"
    const [hours, minutes] = time.split(":")
    const hourNum = Number.parseInt(hours, 10)
    const period = hourNum >= 12 ? "PM" : "AM"
    const displayHour = hourNum % 12 || 12
    return `${displayHour}:${minutes} ${period}`
  }

  const formatTimeForInput = (time) => {
    if (!time) return ""
    return time.substring(0, 5)
  }

  const handleSave = async () => {
    try {
      const payload = {
        daysData: openingHours.map((day) => ({
          day_of_week: day.day_of_week,
          is_open: day.is_open,
          opening_time: day.is_open ? day.opening_time : null,
          closing_time: day.is_open ? day.closing_time : null,
        })),
      }
      await API.post("/salon-admin/opening-hours", payload)
      setIsEditing(false)
      alert("Opening hours updated successfully!")
    } catch (error) {
      console.error("Error updating opening hours:", error)
      alert(`Failed to update opening hours: ${error.response?.data?.error || error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading opening hours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Opening Hours
                </h1>
                <p className="text-indigo-100 text-lg">Manage your salon's operating schedule</p>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-slate-500 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-600 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="group px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:bg-emerald-600 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Hours
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-10">
            <div className="space-y-6">
              {openingHours.map((day, index) => (
                <div
                  key={day.day_of_week}
                  className={`group p-8 rounded-2xl border-2 transition-all duration-200 ${day.is_open
                      ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-300"
                      : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    {/* Day Name */}
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-base ${day.is_open ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                            }`}
                        >
                          {daysOfWeek[day.day_of_week].short}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-800 mb-1">
                          {daysOfWeek[day.day_of_week].name}
                        </h3>
                        <p className={`text-base ${day.is_open ? "text-emerald-600" : "text-slate-500"}`}>
                          {day.is_open ? "Open" : "Closed"}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                      <div className="flex items-center gap-4">
                        <span className="text-base font-medium text-slate-700 min-w-[60px]">Closed</span>
                        <button
                          onClick={() => handleToggleOpen(index)}
                          disabled={!isEditing}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${day.is_open ? "bg-emerald-500" : "bg-slate-300"
                            } ${!isEditing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${day.is_open ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                        <span className="text-base font-medium text-slate-700 min-w-[50px]">Open</span>
                      </div>

                      {/* Time Display/Input */}
                      {day.is_open && (
                        <div className="flex items-center gap-6">
                          {isEditing ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-600">Opening Time</label>
                                <input
                                  type="time"
                                  value={formatTimeForInput(day.opening_time)}
                                  onChange={(e) => handleTimeChange(index, "opening_time", e.target.value)}
                                  className="px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
                                />
                              </div>
                              <div className="text-slate-400 font-bold text-xl self-end pb-3">—</div>
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-600">Closing Time</label>
                                <input
                                  type="time"
                                  value={formatTimeForInput(day.closing_time)}
                                  onChange={(e) => handleTimeChange(index, "closing_time", e.target.value)}
                                  className="px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[140px]"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                              <div className="flex items-center gap-3">
                                <svg
                                  className="h-5 w-5 text-emerald-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-base font-medium text-slate-700 min-w-[80px]">
                                  {formatTimeForDisplay(day.opening_time)}
                                </span>
                              </div>
                              <div className="text-slate-400 font-bold">—</div>
                              <div className="flex items-center gap-3">
                                <svg
                                  className="h-5 w-5 text-red-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-base font-medium text-slate-700 min-w-[80px]">
                                  {formatTimeForDisplay(day.closing_time)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {!day.is_open && (
                        <div className="flex items-center gap-3 bg-slate-200 px-6 py-3 rounded-xl">
                          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-base font-medium text-slate-600">Closed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-10 py-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Changes will be reflected on your public salon profile
              </div>
              <div className="text-xs text-slate-500">
                {openingHours.filter((day) => day.is_open).length} days open this week
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpeningHours
