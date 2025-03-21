import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
// import video from "../assets"
import video from "../assets/videoBG.mp4";

function Banner() {
  return (
    <div className="relative h-[100vh] overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        style={{ opacity: 0.78 }}
      >
        <source
          src={video}
          type="video/mp4"
        />
      </video>

      <AnimatePresence>
        <motion.div
          className="absolute inset-0 flex flex-col justify-center items-center"
          style={{ zIndex: 1 }} // Ensure a higher z-index than the video
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="container px-2 sm:px-5 py-10 sm:py-25 max-w-screen-sm sm:max-w-3xl text-center bg-gray-100 p-5 sm:p-10 bg-opacity-50 rounded-xl shadow-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 m-3">
            Towards a Sustainable Future
            </h1>
            <p className="mt-4 sm:text-xl/relaxed font-bold italic text-green-800">
              "Choose eco-friendly solutions and 
              be a part of the movement for a cleaner, greener planet. 
              Every action counts toward a better tomorrow."
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded group relative bg-green-600 px-8 py-3 text-sm font-medium text-white shadow hover:bg-grey-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                to="/requestCampaign"
              >
                <span className="absolute -start-full transition-all opacity-0 group-hover:opacity-100 group-hover:start-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-5 rtl:rotate-180"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h.01M14 14h.01m-6 4h.01M10 10h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4a1 1 0 011-1zm2-6a1 1 0 100-2 1 1 0 000 2z"
                    ></path>
                  </svg>
                </span>
                <span className="text-sm font-medium transition-all group-hover:ms-2">
                  Request Campaign
                </span>
              </Link>
              <Link
                className="block w-full rounded group relative bg-green-600 px-8 py-3 text-sm font-medium text-white shadow hover:bg-grey-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                to="/report"
              >
                <span className="absolute -start-full transition-all opacity-0 group-hover:opacity-100 group-hover:start-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-5 rtl:rotate-180"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </span>
                <span className="text-sm font-medium transition-all group-hover:ms-2">
                  Report Dumpgrounds
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Banner;


