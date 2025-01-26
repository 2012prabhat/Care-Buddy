import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../slices/doctorSlice";
import Heading from "../components/Heading";
import Calender from "../components/Calender/Calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../components/Loader'

function TakeAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const [currDoctor, setCurrDoctor] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);


  useEffect(() => {
    setDoctorSlots(currDoctor && currDoctor.availableSlots, selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    checkDoctor();
  }, []);

  const checkDoctor = async () => {
    if (doctors.length === 0) {
      const resp = await dispatch(fetchDoctors());
      setDoctor(resp.payload);
    } else {
      setDoctor(doctors);
    }
  };

  const setDoctorSlots = (availSlots, date) => {
    console.log("this is avail slots", availSlots)
    const slots = availSlots?.filter((f) => {
      const slotDate = new Date(f.date);
      const inputDate = new Date(date);

      return (
        slotDate.getFullYear() === inputDate.getFullYear() &&
        slotDate.getMonth() === inputDate.getMonth() &&
        slotDate.getDate() === inputDate.getDate()
      );
    });
    setAvailableSlots(slots && slots[0]?.slots);
  };

  const setDoctor = (allDoc) => {
    let doctor = allDoc?.filter((f) => f._id === doctorId)[0];
    console.log("this is doctor",doctor)
    if (!doctor) navigate("/book-appointments");
    setDoctorSlots(doctor.availableSlots, selectedDate);
    setCurrDoctor(doctor);
  };


if(loading) return <Loader></Loader>
 
  return (
    <>
      <div className="text-lg flex justify-between items-center">
        <div className="bg-[var(--bgCol)] rounded-md items-start flex flex-col p-8">
          <Heading text="Book Your Appointment"></Heading>
          <div className="flex gap-8">
            <div className="desc">
              <div>
                {" "}
                You are going to book appointment of{" "}
                <span className="font-bold">{currDoctor?.username}</span>
              </div>
              <div>
                <div>
                  Speciality -{" "}
                  <span className="font-bold">{currDoctor?.speciality}</span>
                </div>
                <div>
                  Consulting Fees -{" "}
                  <span className="font-bold">
                    {currDoctor?.consultingFees} INR
                  </span>
                </div>
              </div>
            </div>

            <img
              className="h-28 rounded-full bg-[var(--iconCol)] mt-[-30px]"
              src={
                currDoctor?.profilePic === null
                  ? "/doctor.png"
                  : currDoctor.profilePic
              }
              alt=""
            />
          </div>
        </div>

        <Calender date={[selectedDate, setSelectedDate]} />
      </div>

      <div>Available Slots on {selectedDate.toDateString()}</div>
      <div className="flex gap-x-10 flex-wrap">
                       {availableSlots?.map((slot, idx) => {
                         return (
                           <div
                             key={idx}
                             className={`hover:text-white cursor-pointer transition-all  hover:bg-[var(--iconCol)] mt-4 bg-[var(--bgCol)] p-2 min-w-28 flex justify-between items-center rounded-md ${
                               slot.isBooked && "var(--iconCol)"
                             } `}
                           >
                             {slot.time}{" "}
                             <FontAwesomeIcon icon="fa-regular fa-clock" />
                             {/* <FontAwesomeIcon
                               onClick={() =>
                                 deleteSlots(slot.time, m.date, slot.isBooked)
                               }
                               className="cursor-pointer ml-2"
                               color="indianred"
                               icon="fa-solid fa-xmark"
                             /> */}
                           </div>
                         );
                       })}
                     </div>
    </>
  );
}

export default TakeAppointment;
