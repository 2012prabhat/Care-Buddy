import React from 'react'
import Svg from "./Svg" 
import MenuBtn from './MenuBtn'
function MenuBar() {
  return (
    <div className='h-8 bg-[var(--bgCol)] fixed top-[64px] border-y overflow-hidden border-gray-300 w-full flex items-center gap-7 pl-4 z-10'>

        <MenuBtn title="Dashboard" icon="home" redirect="/"/>
        <MenuBtn title="Appointments" icon="notepad" redirect="/appointments"/>
        <MenuBtn title="Availability" icon="calender" redirect="/availability"/>
        <MenuBtn title="Earnings" icon="dollar" redirect="/earnings"/>

        


    </div>
  )
}

export default MenuBar