import React from 'react'
import Heading from '../components/Heading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

function Appointments() {
  return (
   <>
         <div className="fixed top-[95px] bg-[var(--backCol)] w-[96%] py-6 flex justify-between items-center">
         <Heading text="Your Appointments" />
           <Link to='/book-appointments'
                   className="flex items-center px-2 py-1 h-8 bg-[var(--iconCol)] text-white font-semibold rounded shadow hover:bg-[var(--iconColHover)] transition duration-200"
                
                 >
                 <FontAwesomeIcon className='mr-2' icon="fa-regular fa-calendar-check" />
                   Book appointment
                 </Link>
         </div>
   </>
  )
}

export default Appointments