import React from "react";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";

function Home() {
  return (
    <>
      <div className="title">Dashboard</div>

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
