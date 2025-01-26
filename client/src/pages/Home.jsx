import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import Heading from "../components/Heading";
import { AuthContext } from "../auth/AuthContext";

function Home() {
  const {user} = useContext(AuthContext)
  return (
    <>
      <div className="text-left flex justify-between" >
       <Heading text="Dashboard" />
       <div>Welcome,  <span className="text-xl pr-2 font-bold">{user?.username}</span></div>
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="cardsCont w-8/12 flex flex-wrap gap-4">

          <Cards
            redirect="/patients"
            title="Total Patients"
            titleVal="100"
            icon="userCard"
          />

          <Cards
            redirect="/appointments"
            title="Total Appointments"
            titleVal="100"
            icon="notepad"
          />

          <Cards
            redirect="/earnings"
            title="Total Earnings"
            titleVal="100"
            icon="dollar"
          />
        </div>


        <img className="max-w-[30%] rounded-xl" src="doctor-patients.jpg" alt="" />
    

      </div>
    </>
  );
}

export default Home;
