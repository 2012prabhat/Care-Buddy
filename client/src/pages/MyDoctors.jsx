import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import { fetchDoctors } from '../slices/doctorSlice'
import { useDispatch, useSelector } from 'react-redux'
import DoctorCard from '../components/DoctorCard'
import api from '../auth/api'

function MyDoctors() {
  const [doctors,setDoctors] = useState([]);
    const fetchMyDoctors = async ()=>{
      try{
        const resp = await api.get("user/my-doctors");
        setDoctors(resp?.data?.data);
      }catch(err){

      }
      

    }
    useEffect(() => {
      fetchMyDoctors()
    }, []);

  return (
    <>
    <div className='flex flex-start'>
    <Heading text="My Doctors" />
    </div>
    <div className="doctorCont flex w-full flex-wrap gap-x-8 gap-y-4">
    {doctors?.map((doctor) => (
        <DoctorCard key={doctor._id} doctor={doctor} />
      ))}
    </div>
    
    
    </>
  )
}

export default MyDoctors