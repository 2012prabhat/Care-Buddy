
import React, { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import CalendarHeader from "./CalendarHeader"
import CalendarDays from "./CalendarDays"

const Calendar = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = props.date

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="w-[300px] pb-1 max-w-md mx-auto bg-[var(--bgCol)] shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-1 bg-gray-100">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-sm font-semibold text-gray-800">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <CalendarHeader />
      <CalendarDays currentDate={currentDate} selectedDate={selectedDate} onDateClick={handleDateClick} />
      {/* <div className="px-4 py-2 bg-gray-100 text-center">Selected Date: {selectedDate.toDateString()}</div> */}
    </div>
  )
}

export default Calendar

