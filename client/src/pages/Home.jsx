import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import Heading from "../components/Heading";
import { AuthContext } from "../auth/AuthContext";
import api from "../auth/api";
import Loader from "../components/Loader";

function Home() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const getDoctorStats = async () => {
    if (!user) return;
    const resp = await api.get("/user/doctor-stats");
    setStats(resp.data.data);
    setIsLoading(false);
  };

  const getUserStats = async () => {
    if (!user) return;
    const resp = await api.get("/user/user-stats");
    setStats(resp.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.role === "doctor") {
      getDoctorStats();
    }

    if (user?.role === "user") {
      getUserStats();
    }
  }, [user]);
  return (
    <>
      <div className="text-left flex justify-between">
        <Heading text="Dashboard" />
        <div>
          Welcome,{" "}
          <span className="text-xl pr-2 font-bold">{user?.username}</span>
        </div>
      </div>

      <div className="flex w-full justify-between">
      
        <div className="cardsCont w-8/12 h-fit flex flex-wrap gap-4">
          <Cards
            redirect="/appointments"
            title="Total Appointments"
            titleVal={stats.totalAppointments}
            icon="notepad"
            bgColor="#3498db"
            textCol="white"
          />

          {user?.role === "user" && (
            <>
              <Cards
                bgColor="#2c3e50"
                redirect="/my-doctors"
                title="My Doctors"
                titleVal={stats.totalDoctors}
                icon="userCard"
                textCol="white"
              />

<Cards
                bgColor="var(--iconCol)"
                redirect="/book-appointments"
                // title="Book Your Appointment"
                titleVal="Book Your Appointment"
                icon="clock"
                textCol="white"
              />
            </>
          )}

          {user && user?.role === "doctor" && (
            <>
              <Cards
                bgColor="#2c3e50"
                redirect="/my-patients"
                title="Total Patients"
                titleVal={stats.totalPatients}
                icon="userCard"
                textCol="white"
              />

              <Cards
                bgColor="var(--iconCol)"
                redirect="/earnings"
                title="Total Earnings"
                titleVal={`${stats.totalEarnings} INR`}
                icon="dollar"
                textCol="white"
              />
            </>
          )}


        </div>
         

        <img
          className="max-w-[30%] rounded-xl"
          src="doctor-patients.jpg"
          alt=""
        />
      </div>
    </>
  );
}

export default Home;
