import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../auth/api";
import Swal from "sweetalert2";
import { alertConfirm, alertSuccess, alertError } from "../components/Alert";
import Modal from "../components/Modal";
import Heading from "../components/Heading";

function Availability() {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    examineTime: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const { user, setAccessToken, setUser } = useContext(AuthContext);
  const [addAvailDis, setAddAvailDis] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    const filteredData = user?.availableSlots.filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0); // Normalize the item's date to midnight
      return itemDate >= today;
    });

    setAvailableSlots(filteredData);
    console.log(filteredData);
  }, [user]);

  const deleteSlots = async (time, date, isBooked) => {
    if (isBooked)
      return alertError(
        "This slot is booked you need to cancel your appointment first"
      );

    const confirmDeletion = await alertConfirm(
      `Are you sure to delete slot of ${time} on ${new Date(
        date
      ).toLocaleDateString()} ?`
    );

    if (!confirmDeletion.isConfirmed) return;
    try {
      const response = await api.patch("/doctors/delete-slot", { time, date });
      await refreshUserProfile();
      alertSuccess("The slot has been removed successfully.");
    } catch (error) {
      alertError("Error in deleting slot");
    }
  };

  const refreshUserProfile = async () => {
    try {
      const userResponse = await api.get("/user/me");
      console.log("User profile refreshed:", userResponse.data);
      setUser(userResponse.data);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  function isEndTimeAfterStartTime(startTime, endTime) {
    function parseTime24(timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes; // Convert to total minutes since midnight
    }

    const startMinutes = parseTime24(startTime);
    const endMinutes = parseTime24(endTime);

    return endMinutes > startMinutes;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSlots = async (e) => {
    e.preventDefault();

    let isTimeCorrect = isEndTimeAfterStartTime(
      formData.startTime,
      formData.endTime
    );
    console.log(isTimeCorrect);
    if (!isTimeCorrect) {
      return alertError("Start time must be before end time");
    }

    const slots = generateTimeSlots(
      formData.startTime,
      formData.endTime,
      parseInt(formData.examineTime)
    );
    const confirmation = await alertConfirm(
      `Are you sure you want to add slots from ${formData.startTime} to ${formData.endTime} on ${formData.date}`
    );
    if (confirmation.isConfirmed) {
      try {
        const resp = await api.post("/doctors/add-slots", {
          date: formData.date,
          slots,
        });
        alertSuccess("Availability added successfully");
        refreshUserProfile();
      } catch (err) {
        alertError("Something went wrong!");
      }
    }
  };

  function generateTimeSlots(startTime, endTime, examineTime) {
    function parseTime24(timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes; // Convert to total minutes since midnight
    }

    function formatTime12(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const isPM = hours >= 12;
      const formattedHours = ((hours + 11) % 12) + 1; // Convert to 12-hour format
      const formattedMins = mins.toString().padStart(2, "0");
      const period = isPM ? "PM" : "AM";
      return `${formattedHours}:${formattedMins} ${period}`;
    }

    const startMinutes = parseTime24(startTime);
    const endMinutes = parseTime24(endTime);
    const slots = [];

    for (
      let current = startMinutes;
      current <= endMinutes;
      current += examineTime
    ) {
      slots.push(formatTime12(current));
    }

    return slots;
  }

  return (
    <>
      <div className="fixed top-[95px] bg-[var(--backCol)] w-[96%] py-6 flex justify-between items-center">
        <Heading text="Your Availabilty" />
        <button
          className="flex items-center px-6 py-1 h-8 bg-[var(--iconCol)] text-white font-semibold rounded shadow hover:bg-[var(--iconColHover)] transition duration-200"
          onClick={() => setAddAvailDis(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add
        </button>
      </div>
      <div className="pb-16 mt-44">
        {availableSlots?.map((m, i) => {
          return (
            m.slots.length > 0 && (
              <div key={i} className="mt-4">
                <div className="border-b-2 border-blue-500 rounded p-2 w-fit">
                  Date -{" "}
                  {new Date(m.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex gap-x-10 flex-wrap">
                  {m.slots.map((slot, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`mt-4 bg-white p-2 min-w-28 flex justify-between items-center rounded-md ${
                          slot.isBooked && "text-green-500"
                        } `}
                      >
                        {slot.time}{" "}
                        <FontAwesomeIcon
                          onClick={() =>
                            deleteSlots(slot.time, m.date, slot.isBooked)
                          }
                          className="cursor-pointer ml-2"
                          color="indianred"
                          icon="fa-solid fa-xmark"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          );
        })}
      </div>

      <Modal
        isOpen={addAvailDis}
        onClose={() => setAddAvailDis(false)}
        title="Add Availability"
        content={
          <>
            <form className="space-y-4" onSubmit={handleAddSlots}>
              {/* Date Field */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Start Time Field */}
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* End Time Field */}
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Examine Time
                </label>
                <input
                  type="number"
                  id="examineTime"
                  name="examineTime"
                  value={formData.examineTime}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        }
      />
    </>
  );
}

export default Availability;
