import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase/cofig";
import { getFirestore, Timestamp } from "firebase/firestore";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Components/Footer";
import Loader from "../Components/Loader";
import { motion } from "framer-motion"; // Import motion from framer-motion

function Campaign() {
  const [campaignData, setCampaignData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const username = localStorage.getItem("username");

      if (username) {
        const documentRef = doc(db, "users", username);

        try {
          const docSnap = await getDoc(documentRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Username not found in localStorage");
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0];
        const campaignQuery = query(
          collection(getFirestore(), "requests"),
          [where("date", ">=", todayDateString), where("approval", "==", "true")]
        );

        const campaignSnapshot = await getDocs(campaignQuery);
        const campaignData = campaignSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaignData(campaignData);
      } catch (error) {
        console.error("Error fetching approved data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const handleRegisterClick = (reqId) => {
    setSelectedCampaignId(reqId);
    setShowModal(true);
  };

  const handleConfirmRegistration = () => {};

  const handleCancelRegistration = () => {
    setShowModal(false);
  };

  const handleJoinUs = async () => {
    try {
      setShowModal(false);
      const username = localStorage.getItem("username");

      const docRef = doc(db, "requests", selectedCampaignId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        if (!docData.volunteers) {
          await updateDoc(docRef, {
            volunteers: [username],
          });
        } else {
          await updateDoc(docRef, {
            volunteers: arrayUnion(username),
          });
        }
        toast.success("Successfully Registered for campaign", {
          autoClose: 1000,
        });
      } else {
        console.error("Document does not exist");
        toast.error("Failed to register for campaign", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error joining campaign:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "#E2F5D2" }}>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 ">
          <div className="my-2">
            {campaignData.map((req, index) => (
             <motion.article
             className="rounded-xl bg-white p-4 mb-5 sm:p-6 lg:p-8 shadow-md "
             key={req.id}
             initial={{
               opacity: -1,
              y:20,
              x:-25
             }}
             whileInView={{
               opacity: 1,
               y:0,
               x:0,
               transition: {
                 duration: 0.5,
                 
               },
             }}
             
             viewport={{ once: false }}
             
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
                        Hosted by {req.userDetails.Fname}{" "}
                        {req.userDetails.Lname}
                      </p>

                      <div className="bottom-4 right-4">
                        <button
                          className="text-l bg-green-500 text-white py-1 px-1 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800 ml-auto flex items-center"
                          onClick={() => handleRegisterClick(req.id)}
                        >
                          {selectedCampaignId === req.id ? "Registered" : "Register Now"}
                        </button>

                        {showModal && (
                          <div className="fixed inset-0 bg-black opacity-30 z-50"></div>
                        )}

                        {showModal && (
                          <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="rounded-lg bg-white p-8 shadow-2xl">
                              <h3 className="text-lg font-bold">
                                Are you sure you want to register for the
                                Campaign?
                              </h3>
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={handleJoinUs}
                                  className="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600"
                                >
                                  Yes, I'm sure
                                </button>

                                <button
                                  onClick={handleCancelRegistration}
                                  className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
                                >
                                  No, go back
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Campaign;