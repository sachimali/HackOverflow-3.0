import React, { useState, useEffect } from "react";
import { db } from "../Firebase/cofig.js";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import Navbar from "../Components/Navbar.jsx";
// import { navigate } from "gatsby";

export default function Registration() {
  //   User details state variables
  const [Fname, setFName] = useState("");
  const [Lname, setLname] = useState("");
  //   const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDOB] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  // Extract userName and email from location.state
  const {
    userName = "",
    email = "",
    password = "",
    role = "",
  } = location.state || {};
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !Fname ||
      !Lname ||
      !phone ||
      !dob ||
      !state ||
      !city ||
      !address ||
      !aadharNumber
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const userDetails = {
        email,
        password,
        role,
        Fname,
        Lname,
        phone,
        dob,
        state,
        city,
        address,
        aadharNumber,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", userName), userDetails);

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Error submitting user data:", error);
      alert("Error occurred while submitting user data.");
    } finally {
      // Optional code to execute after try or catch block
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center  font-bold  font-custom text-gray-800 md:mb-6 lg:text-4xl ">
              User Details
            </h2>
          </div>

          <form
            className="mx-auto grid max-w-screen-sm gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
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
                htmlFor="dob"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Date of Birth
              </label>
              <input
                value={dob}
                onChange={(e) => setDOB(e.target.value)}
                id="date"
                type="date"
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
                pattern="[0-9]{10}" // 10 digits validation pattern
                title="Phone number must be 10 digits long."
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

            <div className="sm:col-span-1">
              <label
                htmlFor="state"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                State
              </label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                id="state"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="city"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="city"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                id="address"
                className="w-full rounded border border-solid border-green-800 bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-green-100 transition duration-100 focus:ring"
              />
            </div>

            <div className="flex items-center justify-center sm:col-span-2">
              <button
                // style={customStyle}

                className="inline-block rounded-lg px-8 py-3 bg-green-800 text-center text-sm font-semibold text-white outline-none ring-yellow-300 transition duration-100 hover:bg-green-600 focus-visible:ring md:text-base"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}