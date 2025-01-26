import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor}) => {
  const { username, speciality, experience, consultingFees, email, availableSlots, verified } =
    doctor;

  return (
    <div className="bg-white border rounded-lg shadow-lg p-4 min-w-[250px]">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          {doctor.profilePic ? (
            <img
              src={doctor.profilePic}
              alt={username}
              className="w-full h-full rounded-full"
            />
          ) : (
            <img
              src='doctor.png'
              alt={username}
              className="w-full h-full rounded-full"
            />
          )}
        </div>
        {/* Doctor Details */}
        <div>
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="text-sm text-gray-500">{speciality}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm">
          <span className="font-bold">Experience:</span> {experience} years
        </p>
        <p className="text-sm">
          <span className="font-bold">Consulting Fees:</span> {consultingFees} INR
        </p>
        
        {/* <div>
          <h4 className="text-sm font-bold mb-1">Available Slots:</h4>
          <ul className="text-sm list-disc list-inside space-y-1">
            {availableSlots?.map((slot, index) => (
              <li key={index}>{slot.time}</li>
            ))}
          </ul>
        </div> */}
      </div>
      <Link to={`${doctor._id}`}
                   className="flex items-center px-2 py-1 h-8 bg-[var(--iconCol)] text-white font-semibold rounded shadow hover:bg-[var(--iconColHover)] transition duration-200 mt-4"
                
                 >
                 <FontAwesomeIcon className='mr-2' icon="fa-regular fa-calendar-check" />
                   Book appointment 
                 </Link>
    </div>
  );
};


export default DoctorCard;
