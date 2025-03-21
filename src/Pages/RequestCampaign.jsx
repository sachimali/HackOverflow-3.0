import React, { useState } from "react";
// import Header from "../Components/Header";
import Navbar from "../Components/Navbar";
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../Firebase/cofig";
import { useNavigate,Link } from "react-router-dom";
import Footer from "../Components/Footer";

function RequestCampaign() {
  // User details state variables
  const [Fname, setFName] = useState("");
  const [Lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");

  // Campaign details state variables
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignGoals, setCampaignGoals] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();
  // const [endDate, setEndDate] = useState("");

  
 

  const addRequestAndRecord = async (requestDetails) => {
    try {
      const {
        campaignTitle,
        campaignGoals,
        campaignDescription,
        state,
        city,
        address,
        date,
        userDetails,
        startTime,
        endTime,
      } = requestDetails;

      if (!date || typeof date !== "string" || date.length !== 10) {
        throw new Error("Invalid startDate format or empty.");
      }

      const requestsCollectionRef = collection(db, "requests");

      // Add a new request with an automatically generated unique ID and server timestamp
      const newRequestRef = doc(requestsCollectionRef);

      await setDoc(newRequestRef, {
        campaignTitle,
        campaignGoals,
        campaignDescription,
        state,
        city,
        address,
        date,
        startTime,
        endTime,
        approval: "false",
        userDetails,
        timestamp: serverTimestamp(),
      });

      alert("Request created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error adding request and record:", error);
    }
  };

  const reportProblem = (e) => {
    e.preventDefault();

    const userDetails = {
      Fname,
      Lname,
      email,
      phone,
      aadharNumber,
    };

    const requestDetails = {
      campaignTitle,
      campaignGoals,
      campaignDescription,
      state,
      city,
      address,
      date,
      startTime,
      endTime,
      userDetails,
    };

    addRequestAndRecord(requestDetails);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div
        className="py-10 sm:py-10 lg:py-16 bg-cover bg-center relative"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg")',
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div className="mx-auto max-w-screen-xxl px-4 md:px-8 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-center justify-between pt-8 text-white">
              <h2 className="mb-2 text-center text-4xl my-text font-custom font-semibold text-green-900 md:mb-4 md:text-center shadow-xl">
                "Raise the Campaign for a Better Cause!"
              </h2>
              <h2 className="mb-2 text-center text-4xl font-semibold my-text font-custom md:mb-4 md:text-center text-white">
                <span className="text-green-800">Empower</span> |{" "}
                <span className="text-green-800">Inspire</span> |{" "}
                <span className="text-green-800">Contribute</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center  font-bold  font-custom text-gray-800 md:mb-6 lg:text-4xl ">
              Raise a Campaign
            </h2>
          </div>

          <form className="mx-auto grid max-w-screen-lg gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h2 className="mb-4 text-center font-bold text-gray-800 text-lg">
                User Details
              </h2>
            </div>

            <div>
              <label
                for="first-name"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                First name*
              </label>
              <input
                name="first-name"
                value={Fname}
                onChange={(e) => setFName(e.target.value)}
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div>
              <label
                for="last-name"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Last name*
              </label>
              <input
                value={Lname}
                onChange={(e) => setLname(e.target.value)}
                name="last-name"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Email*
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="phone"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Contact no.*
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="phone"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="aadhar-number"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Aadhar Number*
              </label>
              <input
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                id="aadhar-number"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
                pattern="[0-9]{12}" // 12 digits validation pattern
                title="Aadhar number must be 12 digits long."
              />
            </div>

            {/* Campaign Details */}

            <div className="sm:col-span-2">
              <h2 className="mb-4 text-center font-bold text-gray-800 text-lg">
                Campaign Details
              </h2>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="campaign-title"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Campaign Title*
              </label>
              <input
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                id="campaign-title"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="campaign-description"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Campaign Description*
              </label>
              <input
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                id="campaign-description"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="campaign-goal"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Goal/Objective*
              </label>
              <input
                value={campaignGoals}
                onChange={(e) => setCampaignGoals(e.target.value)}
                id="campaign-goal"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="campaign-state"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                State
              </label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                id="campaign-state"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="campaign-city"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="campaign-city"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="campaign-address"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                id="campaign-address"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="start-time"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Start Time*
              </label>
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                type="time"
                id="start-time"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="end-time"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                End Time*
              </label>
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="time"
                id="end-time"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="start-date"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Date*
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                id="date"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="flex items-center justify-center sm:col-span-2">
              <button
                // style={customStyle}
                // onClick={reportproblem}
                className="inline-block rounded-lg px-8 py-3 bg-green-800 text-center text-sm font-semibold text-white outline-none ring-yellow-300 transition duration-100 hover:bg-green-600 focus-visible:ring md:text-base"
                onClick={reportProblem}
              >
                Submit
              </button>
            </div>
          </form>

          <div className=" mx-auto max-w-100 text-center mt-5">
            <p className="text-green-800 sm:text-lg ">
              Already requested a campaign?{" "}
              <Link
                 to="/profile"
                className="text-green-500 underline transition duration-100 hover:text-green-600 active:text-indigo-700"
              >
                Check progress
              </Link>
            </p>
          </div>
        </div>
      </div>

      
    </>
  );
}

export default RequestCampaign;
