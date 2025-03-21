// import React from 'react'
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../Firebase/cofig";
import { getFirestore, Timestamp } from "firebase/firestore";
import NotFound from "./NotFound";

export default function UserCampaign() {
  const [campaignData, setCampaignData] = useState([]);
  const [filter, setFilter] = useState("approved"); // "approved" or "notApproved"

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0];

        let campaignQuery;

        if (filter === "all") {
          // Fetch all documents without the where clause
          campaignQuery = query(
            collection(getFirestore(), "requests"),
            where("userDetails.email", "==", email)
          );
        } else {
          // Fetch documents based on approval status
          campaignQuery = query(
            collection(getFirestore(), "requests"),
            where("approval", "==", filter === "approved" ? "true" : "false"),
            where("userDetails.email", "==", email)
          );
        }

        const campaignSnapshot = await getDocs(campaignQuery);
        const campaignData = campaignSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaignData(campaignData);
        // console.log("data:", campaignData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchCampaignData();
  }, [filter, email]);

  return (
    <>
      <div className=" py-2 flex flex-col text-center w-full mb-3 ">
        <h1 className="m-2 sm:text-3xl text-2xl  title-font font-bold text-gray-800">
          Campaigns Hosted by you
        </h1>

      </div>

      <div className="">
        <div className="mb-4 flex justify-center">
          <label htmlFor="filter" className="mr-2 text-lg">
            Filter:
          </label>
          <select
            id="filter"
            className="mt-1 p-2 border border-black rounded-md bg-white-300 py-1 px-4 focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="approved">Approved</option>
            <option value="notApproved">Not Approved</option>
            <option value="all">All</option>
          </select>
        </div>
        {campaignData.length === 0 ? (
          <>
            <body class="flex flex-col justify-center items-center mx-4 py-4">
              <div class="flex flex-col items-center pb-4">
                <NotFound />
                <p class="text-xl font-medium text-gray-600 mb-6">
                  Looks like you have not hosted any campaigns yet!!!
                </p>
                <Link
                  to="/requestcampaign"
                  class="px-4 py-2 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-all duration-200 ease-in-out"
                >
                  Request Campaign
                </Link>
              </div>
            </body>
          </>
        ) : (
          campaignData.map((req) => (
            <div className="flex items-center justify-center ">
            
            <article
              key={req.id}
              className="my-3 w-3/4 rounded-xl bg-white p-3  ring ring-green-100  lg:p-5 no-underline "
            >
              <Link
                to={`/campaign/${req.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className=" my-5 flex items-start sm:gap-8 ">
                  <div>
                    <strong className=" rounded border border-green-500 bg-green-500 px-3 py-1.5 text-[10px] font-medium text-white">
                      {req.date}
                    </strong>

                    <h3 className="mt-4 text-lg font-medium sm:text-xl">
                      <div>{req.campaignTitle}</div>
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      {req.campaignDescription}
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      <b>Address: </b>
                      {req.address}
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      <b>City: </b>
                      {req.city}
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      <b>State: </b>
                      {req.state}
                    </p>

                    <div className="mt-4 sm:flex sm:items-center sm:gap-2">
                      <div className="flex items-center gap-1 text-gray-500">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>

                        <p className="text-xs font-medium">
                          {req.startTime} - {req.endTime}
                        </p>
                      </div>

                      <span className="hidden sm:block" aria-hidden="true">
                        &middot;
                      </span>

                      <p className="mt-2 text-xs font-medium text-gray-500 sm:mt-0">
                        Hosted by {req.userDetails.Fname}{" "}
                        {req.userDetails.Lname}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </article>

            </div>
          ))
        )}
        {}
      </div>
    </>
  );
}
