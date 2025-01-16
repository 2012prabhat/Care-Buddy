import React from 'react'
import { Link } from 'react-router-dom'
import Svg from './Svg'

function Cards({title, titleVal, redirect, icon, iconClass}) {
  return (
    <Link to={redirect} className="card flex min-w-[250px] px-5 shadow-lg justify-between w-[40%] rounded-md items-center bg-[var(--bgCol)] mt-4 py-8">
    <div>
    <div className=''>{title}</div>
    <div className='font-bold text-xl'>{titleVal}</div>
    </div>

    <div className={`px-3 py-3 cursor-pointer shadow-sm rounded-md min-w-[50px] w-[20%] flex justify-end items-center bg-[var(--backCol)]`}>
      {icon==="userCard"?
      <img src="userCard.svg" alt="" />
      :<Svg type={icon} color='var(--iconCol)'></Svg>}
     
     
    </div>
    
  </Link>
  )
}

export default Cards