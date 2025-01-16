import React from 'react'
import Svg from "./Svg" 
import MenuBtn from './MenuBtn'
function MenuBar() {
  return (
    <div className='h-8 bg-[var(--bgCol)] fixed top-[67px] w-full flex items-center gap-7 pl-4'>

        <MenuBtn title="Dashboard" icon="home" redirect="/"/>
        <MenuBtn title="Appointments" icon="notepad" redirect="/appointments"/>
        <MenuBtn title="Availability" icon="calender" redirect="/availability"/>
        <MenuBtn title="Earnings" icon="dollar" redirect="/earnings"/>

        


    </div>
  )
}

export default MenuBar