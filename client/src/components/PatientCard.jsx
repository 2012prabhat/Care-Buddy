import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const PatientCard = ({ patient}) => {
  const { username,email} = patient;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-4 min-w-[250px]">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          {patient.profilePic ? (
            <img
              src={patient.profilePic}
              alt={username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <img
              src='doctor.png'
              alt={username}
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        {/* Doctor Details */}
        <div>
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

     
      {/* <Link to={`/book-appointments/${patient._id}`}
                   className="flex items-center px-2 py-1 h-8 bg-[var(--iconCol)] text-white font-semibold rounded shadow hover:bg-[var(--iconColHover)] transition duration-200 mt-4"
                
                 >
                 <FontAwesomeIcon className='mr-2' icon="fa-regular fa-calendar-check" />
                   Book appointment 
                 </Link> */}
    </div>
  );
};


export default PatientCard;
