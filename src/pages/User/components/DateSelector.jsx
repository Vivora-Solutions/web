"use client"

const DateSelector = ({
  days,
  selectedDate,
  onDateSelect,
  calendarOffset,
  setCalendarOffset,
  minOffset,
  formatDayCircle,
  formatDayLabel,
}) => {
  return (
    <div className="mb-8 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
      <label className="font-semibold text-gray-800 mb-4 block text-lg">Select a Date:</label>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          className="flex-shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCalendarOffset((prev) => Math.max(prev - 7, minOffset))}
          disabled={calendarOffset <= minOffset}
          title="Previous 7 days"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-3 flex-grow justify-center">
          {days.map((date, idx) => {
            const iso = date.toISOString().slice(0, 10)
            const isSelected = selectedDate === iso
            const isToday = date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)

            return (
              <button
                key={iso}
                type="button"
                onClick={() => onDateSelect(iso)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 shadow-sm transition-all duration-200 flex-shrink-0
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-700 text-white scale-105 shadow-lg"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200"
                  }
                  ${isToday && !isSelected ? "border-blue-400 text-blue-600 font-bold" : ""}
                `}
              >
                <span className="text-base font-semibold">{formatDayCircle(date)}</span>
                <span className="text-xs">{formatDayLabel(date)}</span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="flex-shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 transition-all duration-200"
          onClick={() => setCalendarOffset((prev) => prev + 7)}
          title="Next 7 days"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default DateSelector
