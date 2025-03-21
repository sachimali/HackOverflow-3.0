import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import UserBlogs from "../Components/UserBlogs.jsx";
import UserDetails from "../Components/UserDetails.jsx";
import UserCampaign from "../Components/UserCampaign.jsx";
import UserCertificates from "../Components/UserCertificates.jsx";
import UserUpcomingCampaign from "../Components/UserUpcomingCampaign.jsx";
import Footer from "../Components/Footer.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("blogs");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Navbar />

      <div className="mb-5">
        <UserDetails />
      </div>

      <span class="flex items-center pb-4">
        <span class="h-px flex-1 bg-green-500"></span>
        <span class="h-px flex-1 bg-green-500"></span>
      </span>

      <div className="flex justify-center items ">
        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 border-b border-gray-300 ">
          <fieldset className="flex flex-wrap mb-3">
            <legend className="sr-only">Tab Options</legend>

            <div>
              <button
                className={`${
                  activeTab === "blogs"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("blogs")}
              >
                Blogs
              </button>
            </div>

            <div>
              <button
                className={`${
                  activeTab === "campaigns"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem] `}
                onClick={() => handleTabChange("campaigns")}
              >
                Campaigns
              </button>
            </div>

            <div>
              <button
                className={`${
                  activeTab === "upcomingCampaigns"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("upcomingCampaigns")}
              >
                Enrolled Campaigns
              </button>
            </div>

            
          </fieldset>
        </div>
      </div>

      {activeTab === "blogs" && (
        <div className="mx-10 bg-white">
          <UserBlogs />
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="px-6  bg-white">
          <UserCampaign />
        </div>
      )}

      
      {activeTab === "upcomingCampaigns" && (
        <div className="px-6 md:px-8 bg-white">
          <UserUpcomingCampaign />
        </div>
      )}

      
    </>
  );
}

export default App;
