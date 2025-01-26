import React from "react"

const CalendarHeader = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="grid grid-cols-7 gap-1 bg-gray-50 border-b border-gray-200">
      {daysOfWeek.map((day) => (
        <div key={day} className="text-center p1-2 text-sm font-medium text-gray-500">
          {day}
        </div>
      ))}
    </div>
  )
}

export default CalendarHeader

