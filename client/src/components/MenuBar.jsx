import React from 'react'
import Svg from "./Svg" 
import MenuBtn from './MenuBtn'
import { useLocation, useNavigate } from 'react-router-dom';
function MenuBar({user}) {
  const navigate = useNavigate();
  const location = useLocation();


  const handleGoBack = () => {
    if(location.pathname==='/') return 
    navigate(-1); // Navigate to the previous page
  };
  return (
    <div className='h-8 bg-[var(--bgCol)] fixed top-[64px] border-y overflow-hidden border-gray-300 w-full flex items-center gap-7 pl-4 '>
    
        <MenuBtn style={location.pathname==='/'?{pointerEvents:'none',opacity:0.5}:{}} title="Back" icon="back" onClick={handleGoBack}/>
        <MenuBtn title="Dashboard" icon="home" redirect="/"/>
        <MenuBtn title="Appointments" icon="notepad" redirect="/appointments"/>


      {user?.role==='doctor' && 
      <>
            <MenuBtn title="Availability" icon="calender" redirect="/availability"/>
<MenuBtn title="Earnings" icon="dollar" redirect="/earnings"/>
      </>

}

  

        


    </div>
  )
}

export default MenuBar