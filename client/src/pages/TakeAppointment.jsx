import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../slices/doctorSlice";
import Heading from "../components/Heading";
import Calender from "../components/Calender/Calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../components/Loader'
import { alertSuccess,alertError,alertConfirm } from "../components/Alert";
import api from "../auth/api";


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

  const bookAppointment = async (time)=>{
    let date = new Date(selectedDate).toISOString().split('T')[0];
    const data = {
        date,doctorId:currDoctor._id,time
    }
    const confirm = await alertConfirm(`Are you sure you want to book the appointment for ${date} at ${time} ?`);
   
    if(!confirm.isConfirmed) return;
    
    try{
        const appointmentResp = await api.post('/appointment/book',data)
        alertSuccess('Appointment Book Successfully!')
        const resp = await dispatch(fetchDoctors());
        setDoctor(resp.payload);
    }catch(err){
        alertError('Appointment booking failed, try again after some time.')
    }
  }


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
                           onClick={()=>bookAppointment(slot.time)}
                             key={idx}
                             className={`hover:text-white cursor-pointer transition-all  hover:bg-[var(--iconCol)] mt-4 bg-[var(--bgCol)] p-2 min-w-28 flex justify-between items-center rounded-md d ${
                               slot.isBooked && " pointer-events-none opacity-50"
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
