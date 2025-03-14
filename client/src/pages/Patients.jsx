import React, { useEffect, useState } from 'react'
import Heading from '../components/Heading'
import { fetchDoctors } from '../slices/doctorSlice'
import { useDispatch, useSelector } from 'react-redux'
import PatientCard from '../components/PatientCard'
import api from '../auth/api'

function Patients() {
  const [patientsList,setPatientsList] = useState([]);

    const fetchMyPatients = async ()=>{
      try{
        const resp = await api.get("user/my-patients");
        setPatientsList(resp?.data?.data);
      }catch(err){

      }
      

    }
    useEffect(() => {
      fetchMyPatients()
    }, []);

  return (
    <>
    <div className='flex flex-start'>
    <Heading text="My Patients" />
    </div>
    <div className="doctorCont flex w-full flex-wrap gap-x-8 gap-y-4">
    {patientsList?.map((patient) => (
        <PatientCard key={patient._id} patient={patient} />
      ))}
    </div>
    
    
    </>
  )
}

export default Patients