
import React from "react"

const CalendarDays = ({ currentDate, selectedDate, onDateClick }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date(new Date().setHours(0, 0, 0, 0))

  return (
    <div className="grid grid-cols-7 gap-1 p-2">
      {days.map((day, index) => {
        const isPastDate = day && day < today
        const isToday = day && day.toDateString() === today.toDateString()
        const isSelected = day && day.toDateString() === selectedDate.toDateString()

        return (
          <div
            key={index}
            className={`h-8 flex items-center justify-center text-sm 
              ${day ? "cursor-pointer" : ""}
              ${isPastDate ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}
              ${isToday ? "bg-blue-100" : ""}
              ${isSelected ? "bg-[var(--iconCol)] text-white hover:text-[var(--iconCol)] font-semibold" : ""}
            `}
            onClick={() => day && !isPastDate && onDateClick(day)}
          >
            {day?.getDate()}
          </div>
        )
      })}
    </div>
  )
}

export default CalendarDays



