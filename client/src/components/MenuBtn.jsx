import React from 'react'
import Svg from "./Svg" 
import { Link } from 'react-router-dom'


function MenuBtn({title, style, redirect, icon, onClick}) {
  return (
    <Link onClick={onClick} style={style} to={redirect} className="icons flex h-[100%] cursor-pointer ml-2 px-2 items-center hover:scale-110 transition-all">
    <Svg type={icon} color='var(--iconCol)'  className="icons px-1 py-1 cursor-pointer h-[100%] rounded-sm" /> 
    <div className='ml-2 hover:text-[var(--iconCol)]'>{title}</div>  
</Link>
  )
}

export default MenuBtn