import React, { useEffect, useState } from "react";
import Heading from "../components/Heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../auth/api";

function Earnings() {
  const [earning, setEarning] = useState([]);

  const getAllEarnings = async () => {
    try {
      const resp = await api.get("/earning");
      setEarning(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllEarnings();
  }, []);

  return (
    <>
      <div className="fixed top-[95px] bg-[var(--backCol)] w-[96%] pt-5 flex justify-between items-center">
        <Heading text="Your Earnings" />
        <div className="mr-12 text-xl flex gap-2 items-center">
          <FontAwesomeIcon icon="fa-solid fa-indian-rupee-sign" />
          <div className="text-[var(--iconCol)]">{earning?.totalEarnings}</div>
        </div>
      </div>

      <div className="earningListCont mt-40">
        {earning?.list?.length===0 && <div className="w-full text-center pt-4">
        There are no earnings till now
        </div>}
        {earning?.list?.map((m) => {
          return (
            <div
              key={m._id}
              className="w-full bg-[var(--bgCol)] mt-2 flex justify-between items-center shadow-lg rounded-md px-10"
            >
              <div>
                <div>{new Date(m.date).toDateString()}</div>
                <div>{m.time}</div>
              </div>

              <div>Your Earning - {m.consultingFees} INR</div>
              <div className="min-w-2xl flex flex-col justify-between items-center">
                {/* <div>Patients Detail</div> */}
                <div className="flex rounded-lg p-2">
                  <div>
                    <div> {m.patient.username} </div>
                    <div>{m.patient.email}</div>
                  </div>

                  <img
                    src={m.patient.profilePic}
                    className="h-10 rounded-full ml-4"
                    alt=""
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Earnings;
