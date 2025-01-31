import React, { useEffect, useState, useContext } from "react";
import Heading from "../components/Heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import api from "../auth/api";
import {alertSuccess, alertError, alertConfirm} from '../components/Alert'
import { AuthContext } from "../auth/AuthContext";





function Appointments() {
    const { user, setAccessToken } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState("today");

  const tabs = [
    { id: "today", label: "Today's Appointments" },
    { id: "cancelled", label: "Cancelled Appointments" },
    { id: "completed", label: "Completed Appointments" },
    { id: "pending", label: "Pending Appointments" },
    { id: "confirmed", label: "Confirmed Appointments" },
  ];

  const [appList, setAppList] = useState([]);
  const [filteredAppList,setFilteredAppList] = useState(null);

  const getAppList = async () => {
    try {
      const resp = await api.get("/appointment/me");
      setAppList(resp?.data.appointments);
      setSelectedAppointments(resp?.data.appointments)
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppList();
  }, []);


  useEffect(()=>{
    setSelectedAppointments()
  },[activeTab])

  const setSelectedAppointments = (appointmentList=appList)=>{
    const getAppStatus = status=>appointmentList.filter((f)=>f.status===status);
    
      if(activeTab==='cancelled') setFilteredAppList(getAppStatus('cancelled'));
      if(activeTab==='completed') setFilteredAppList(getAppStatus('completed'));
      if(activeTab==='pending') setFilteredAppList(getAppStatus('pending'));
      if(activeTab==='confirmed') setFilteredAppList(getAppStatus('confirmed'));
      if(activeTab==='today'){
        let todayApp = appointmentList.filter((f)=>{
            const todayDate = new Date().toISOString().split('T')[0];
            return f.date.split('T')[0] === todayDate;
        })
        setFilteredAppList(todayApp)
      }
  }

  const updateAppoint = async (status,id)=>{
    const confirm = await alertConfirm('Are you sure ?');
    if(!confirm.isConfirmed) return
    try{
      const resp = await api.patch(`/appointment/${id}`,{status});
      alertSuccess(`Appointment ${status} successfully`);
      getAppList()
    }catch(err){
      alertError(err.response.data.message || "Error in updation of appointment")
    }
  }

  return (
    <>
      <div className="fixed top-[95px] bg-[var(--backCol)] w-[96%] pt-5 flex justify-between items-center">
        <Heading text="Your Appointments" />
        <Link
          to="/book-appointments"
          className="flex items-center px-2 py-1 h-8 bg-[var(--iconCol)] text-white font-semibold rounded shadow hover:bg-[var(--iconColHover)] transition duration-200"
        >
          <FontAwesomeIcon
            className="mr-2"
            icon="fa-regular fa-calendar-check"
          />
          Book appointment
        </Link>

        
      </div>
       <div className="p-6 mt-[10rem]">
      <div className="flex space-x-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === tab.id
                ? "bg-[var(--iconCol)] text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* <div className="mt-6">
        {activeTab === "today" && <div>Displaying Today's Appointments</div>}
        {activeTab === "cancelled" && <div>Displaying Cancelled Appointments</div>}
        {activeTab === "completed" && <div>Displaying Completed Appointments</div>}
        {activeTab === "pending" && <div>Displaying Pending Appointments</div>}
      </div> */}
    </div>
      <div className="flex flex-wrap gap-5">
      
          {filteredAppList?.length===0 ? <div className="flex mt-8 justify-center w-full">
          There are no {activeTab} appointments
          </div>:filteredAppList?.map((m)=>{
            return <div    className={`shadow mt-4 p-4 w-[280px] min-w-fit justify-between border-b-4 ${
              m.status === 'pending' ? 'border-yellow-500': m.status === 'cancelled' ? 'border-red-500' : m.status==='confirmed'?'border-green-500':m.status==='completed'?'border-green-500':""
            }`}>
              <div>
                {new Date(m.date).toDateString()} at {m.time}
              </div>
              <div>
                Patient Name - {m?.patient?.username}
              </div>
              <div className="flex mt-2">
                <div className="mr-2">Status - {m.status}</div>
                {m.status==='pending' && <>
                 {user.role==='doctor' && <FontAwesomeIcon
            className="mr-2 text-white p-1 flex h-4 w-4 rounded-full bg-green-800 cursor-pointer"
            icon="fa-solid fa-check"
            onClick={()=>updateAppoint('confirmed',m._id)}
          />}
           <FontAwesomeIcon
            className="mr-2 flex h-4 w-4 text-white p-1 rounded-full bg-red-800 cursor-pointer"
            icon="fa-solid fa-close"
            onClick={()=>updateAppoint('cancelled',m._id)}
          />
                </>}


                {m.status==='confirmed' && user.role==='doctor' && <>
                  <FontAwesomeIcon
            className="mr-2 text-white p-1 flex h-4 w-4 rounded-full bg-green-800 cursor-pointer"
            icon="fa-solid fa-check"
            onClick={()=>updateAppoint('completed',m._id)}
          />
           
                </>}
              
              </div>
            </div>
          })}
        </div>
    </>
  );
}

export default Appointments;
