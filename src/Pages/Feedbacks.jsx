import React, { useState } from "react";
import { db } from "../Firebase/cofig";
import {
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import Navbar from "../Components/Navbar";

export default function Feedbacks() {
  const [formData, setFormData] = useState({
    authname: "",
    imgLink: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any of the form fields are empty
    if (!formData.authname || !formData.imgLink || !formData.content) {
      alert("Please fill in all fields.");
      return; // Stop further execution
    }

    try {
      const username = localStorage.getItem("username");
      const feedbackRef = collection(db, "feedback");
      const feedbackDoc = doc(feedbackRef, username);

      // Add a new document to the 'feedback' collection with username as the document ID
      await setDoc(feedbackDoc, {
        authname: formData.authname,
        imgLink: formData.imgLink,
        content: formData.content,
        approved: false,
      });

      alert("Feedback posted successfully!");

      // Clear form fields after submission
      setFormData({
        authname: "",
        imgLink: "",
        content: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to post feedback!");
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white py-6 sm:py-8 lg:py-12 mx-2 md:mx-4">
        <div className="mx-auto max-w-screen-md">
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-800 md:mb-6 lg:text-4xl">
              Share Your Thoughts with Us!
            </h2>

            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              Your feedback is invaluable to us. Whether it's praise,
              suggestions, or concerns, we're here to listen and improve. Let
              your voice be heard!
            </p>

            <form
              className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mt-4"
              onSubmit={handleSubmit}
            >
              <div className="sm:col-span-2">
                <label
                  htmlFor="authname"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Author Name
                </label>
                <input
                  name="authname"
                  value={formData.authname}
                  onChange={handleChange}
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="img-link"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Paste Image-Link/Company Logos
                </label>
                <input
                  name="imgLink"
                  value={formData.imgLink}
                  onChange={handleChange}
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="content"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Type Your Feedback Here
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="h-40 w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                ></textarea>
              </div>

              <div className="flex items-center justify-between sm:col-span-2 mt-4">
                <button
                  type="submit"
                  className="inline-block rounded-lg bg-green-500 px-6 py-3 text-center text-sm font-semibold text-white outline-none ring-green-300 transition duration-100 hover:bg-green-600 focus-visible:ring active:bg-green-700 md:text-base"
                >
                  POST
                </button>

                <span className="text-sm text-gray-500">*Required</span>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                By signing up to our newsletter you agree to our{" "}
                <a
                  href="#"
                  className="underline transition duration-100 hover:text-green-500 active:text-green-600"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}
