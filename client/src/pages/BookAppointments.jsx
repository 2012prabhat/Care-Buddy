import React, { useEffect } from 'react'
import Heading from '../components/Heading'
import { fetchDoctors } from '../slices/doctorSlice'
import { useDispatch, useSelector } from 'react-redux'
import DoctorCard from '../components/DoctorCard'

function BookAppointments() {
    const dispatch = useDispatch();
    const { doctors, loading, error } = useSelector((state) => state.doctors);
  
    useEffect(() => {
      dispatch(fetchDoctors());
    }, [dispatch]);

  return (
    <>
    <div className='flex flex-start'>
    <Heading text="Book Appointment" />
    </div>
    <div className="doctorCont flex w-full flex-wrap gap-x-8 gap-y-4">
    {doctors?.map((doctor) => (
        <DoctorCard key={doctor._id} doctor={doctor} />
      ))}
    </div>
    
    
    </>
  )
}

export default BookAppointments