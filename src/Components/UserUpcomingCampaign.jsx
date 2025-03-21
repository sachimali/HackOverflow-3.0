import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../Firebase/cofig.js";
import NotFound from "./NotFound";

export default function UserUpcomingCampaign() {
  const [campaignData, setCampaignData] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  useEffect(() => {
    // Fetch campaign data from Firestore
    const fetchData = async () => {
      try {
        const campaignCollection = collection(db, "requests");
        const campaignSnapshot = await getDocs(campaignCollection);
        const data = campaignSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCampaignData(data);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter campaigns based on user's username and upcoming dates
    const username = localStorage.getItem("username");

    if (username) {
      const filteredCampaigns = campaignData.filter((campaign) => {
        const currentDate = new Date();

        // Convert the date string to a Date object
        const campaignDate = new Date(campaign.date);

        // Check if 'volunteers' is defined and is an array
        const volunteersArray =
          Array.isArray(campaign.volunteers) &&
          campaign.volunteers !== undefined
            ? campaign.volunteers
            : [];

        // Check if the user has registered and the campaign is upcoming
        return volunteersArray.includes(username) && campaignDate > currentDate;
      });

      setFilteredCampaigns(filteredCampaigns);
    }
  }, [campaignData]);

  return (
    <>
      <div className=" py-2 mt-2  flex flex-col text-center w-full mb-1">
        <h1 className="sm:text-3xl text-2xl title-font font-bold text-gray-800">
          Upcoming Campaigns
        </h1>

        
      </div>

      <div className="my-8 py-4 ">
        {filteredCampaigns.length === 0 ? (
          <>
            <body class="flex flex-col justify-center items-center py-4  ">
              <div class="flex flex-col justify-center pb-4">
                <div className="mb-2">
                  <NotFound />
                </div>
                <p class="text-2xl font-medium text-gray-600 mb-6">
                  Looks like you have not enrolled to any campaigns yet!!!
                </p>
              </div>
            </body>
          </>
        ) : (
          filteredCampaigns.map((req) => (
            <div className="flex items-center justify-center ">
            <article
              className="rounded-xl w-3/4  bg-white p-8 ring mb-5  ring-indigo-50 sm:p-6 lg:p-8"
              key={req.id}
            >
              <div className="flex items-start sm:gap-8">
                <div>
                  <strong className=" rounded border border-green-500 bg-green-500 px-3 py-1.5 text-[10px] font-medium text-white">
                    {req.date}
                  </strong>

                  <h3 className="mt-4 text-lg font-medium sm:text-xl">
                    <div> {req.campaignTitle} </div>
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
                      Hosted by {req.userDetails.Fname} {req.userDetails.Lname}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            </div>
          ))
        )}
        {}
      </div>
    </>
  );
}
