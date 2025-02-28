import React, { useState, useEffect } from "react";
import api from '../auth/api'
import { alertError, alertSuccess } from "../components/Alert";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const Profile = () => {
    const {user,setUser} = useContext(AuthContext)
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");

  const getUserProfile = async ()=>{
    try{
        const resp = await api.get('/user/me');
        setUser(resp.data)
        setProfilePic(resp.data?.profilePic)
    }catch(err){
        alertError('Failed to fetch user profile')
    } 
  }


  useEffect(()=>{
    getUserProfile()
  },[])

  // Handle profile picture change
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfilePic(reader.result); // Update the profile 
        // picture URL
        // Here you can also upload the file to the server and update the database
        try{
            const formData = new FormData();
            formData.append('profilePic',file)
           const resp = await api.post('/user/profile-pic',formData);
           alertSuccess(resp.data.message);
        getUserProfile()

       }catch(err){
         console.log(err)
         alertError('Failed to change profile picture')
       }
      };
      reader.readAsDataURL(file);
      

    }
  };

  // Render role-specific fields for doctors
  const renderDoctorFields = () => {
    if (user?.role === "doctor") {
      return (
        <>
          <p className="text-gray-700">
            <strong>Speciality:</strong> {user?.speciality}
          </p>
          <p className="text-gray-700">
            <strong>Consulting Fees:</strong> ₹{user?.consultingFees}
          </p>
          <p className="text-gray-700">
            <strong>Experience:</strong> {user?.experience} years
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profilePic || "userAvatar.png"} // Default avatar if no profile picture
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-[var(--iconCol)] object-cover"
        />
        <input
          type="file"
          id="profilePicInput"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="hidden"
        />
        <button
          onClick={() => document.getElementById("profilePicInput").click()}
          className="mt-4 px-4 py-2 bg-[var(--iconCol)] text-white rounded-md hover:bg-[var(--iconColHover)]transition-colors"
        >
          Change Profile Picture
        </button>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">{user?.username}</h1>
        <p className="text-gray-600">{user?.email}</p>
        {renderDoctorFields()}
      </div>
    </div>
  );
};

export default Profile;