import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../auth/api";
import {useNavigate} from 'react-router-dom'
import {alertConfirm} from '../components/Alert'



function UserDrop({user}) {
  const navigate = useNavigate();
 
  const handleLogout = async()=>{
    const confirm = await alertConfirm('Are you sure you want to logout?');
    if(!confirm.isConfirmed) return;
    try{
      const resp = await api.post('/auth/logout');
      localStorage.removeItem("accessToken");
      navigate('/login')
    }catch(err){
      console.log(err)
    }
    
  }
  return (
    <div className=" z-20 absolute mt-56 right-7  bg-[var(--bgCol)] border rounded-lg shadow-lg">
    <br />
        <div className='p-2 font-bold text-center'>You are logged in as</div>
        <div className='p-2 font-bold text-center'>{user.username}</div>
          <ul className="py-2">
            {/* <li className="text-nowrap min-w-fit px-4 py-2 hover:bg-gray-100 cursor-pointer">option 1</li>
            <li className="text-nowrap min-w-fit px-4 py-2 hover:bg-gray-100 cursor-pointer">option 1</li> */}
            <li className="text-nowrap min-w-fit px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Log out <FontAwesomeIcon className='text-xs text-red-700' icon="fa-solid fa-power-off" /></li>
           
          </ul>
        </div>
  )
}

export default UserDrop