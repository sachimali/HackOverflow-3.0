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
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence

// Sample leaderboard data - replace with your actual data fetching logic
const leaderboardData = [
  {
    id: 1,
    name: "Sarah Johnson",
    contributions: 32,
    campaigns: 15,
    badges: [
      { id: 1, code: "R", color: "#27ae60" },
      { id: 2, code: "W", color: "#e74c3c" },
      { id: 3, code: "E", color: "#f39c12" }
    ],
    badgeType: "gold"
  },
  {
    id: 2,
    name: "Michael Chen",
    contributions: 28,
    campaigns: 12,
    badges: [
      { id: 1, code: "R", color: "#27ae60" },
      { id: 2, code: "C", color: "#3498db" }
    ],
    badgeType: "silver"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    contributions: 25,
    campaigns: 10,
    badges: [
      { id: 1, code: "R", color: "#27ae60" },
      { id: 2, code: "W", color: "#e74c3c" }
    ],
    badgeType: "bronze"
  },
  {
    id: 4,
    name: "James Wilson",
    contributions: 22,
    campaigns: 8,
    badges: [
      { id: 1, code: "C", color: "#3498db" }
    ],
    badgeType: "standard"
  }
];

// Leaderboard Component
const Leaderboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('recent');

  // Badge styles
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'gold': return {
        background: 'linear-gradient(135deg, #f9d423 0%, #e65c00 100%)'
      };
      case 'silver': return {
        background: 'linear-gradient(135deg, #bdc3c7 0%, #8e9eab 100%)'
      };
      case 'bronze': return {
        background: 'linear-gradient(135deg, #e79e4f 0%, #a87732 100%)'
      };
      default: return {
        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
      };
    }
  };

  // Badge letter function
  const getBadgeLetter = (type) => {
    switch (type) {
      case 'gold': return 'G';
      case 'silver': return 'S';
      case 'bronze': return 'B';
      default: return 'S';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div 
            className="fixed top-0 right-0 h-full max-w-xs w-full bg-white shadow-lg z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Leaderboard</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Members with the most participation in EcoWise campaigns
              </p>

              <div className="tabs flex justify-center mb-4">
                <button 
                  className={`tab px-3 py-1 mx-1 rounded-full text-sm font-semibold cursor-pointer border-none ${activeTab === 'recent' ? 'bg-gray-800 text-white' : 'bg-white'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent
                </button>
                <button 
                  className={`tab px-3 py-1 mx-1 rounded-full text-sm font-semibold cursor-pointer border-none ${activeTab === 'allTime' ? 'bg-gray-800 text-white' : 'bg-white'}`}
                  onClick={() => setActiveTab('allTime')}
                >
                  All Time
                </button>
              </div>
              
              <div className="leaderboard-list flex flex-col gap-3">
                {leaderboardData.map((user, index) => (
                  <div className="leaderboard-item flex items-center bg-white rounded-lg p-2 shadow-sm transition duration-200 hover:-translate-y-1 relative" key={user.id}>
                    <div className="rank text-base font-bold w-6 text-center">{index + 1}</div>
                    <div className="user-info flex items-center flex-1">
                      <div 
                        className="badge w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm"
                        style={getBadgeStyle(user.badgeType)}
                      >
                        {getBadgeLetter(user.badgeType)}
                      </div>
                      <div className="user-details flex flex-col">
                        <div className="user-name text-sm font-semibold">{user.name}</div>
                        <div className="view-count text-gray-500 text-xs">{user.contributions} contributions</div>
                      </div>
                    </div>
                    <div className="badges-container flex flex-wrap gap-1 ml-auto justify-end">
                      {user.badges.slice(0, 2).map(badge => (
                        <div 
                          key={badge.id}
                          className="badge-small w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold" 
                          style={{ backgroundColor: badge.color, color: 'white' }}
                        >
                          {badge.code}
                        </div>
                      ))}
                      {user.badges.length > 2 && (
                        <div className="text-xs text-gray-500">+{user.badges.length - 2}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="see-more text-center py-2 bg-gray-100 rounded-lg mt-2 text-sm font-semibold text-gray-800 cursor-pointer">
                  See More
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function Campaign() {
  const [campaignData, setCampaignData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

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

  // Toggle leaderboard sidebar
  const toggleLeaderboard = () => {
    setIsLeaderboardOpen(!isLeaderboardOpen);
  };

  // Close leaderboard sidebar
  const closeLeaderboard = () => {
    setIsLeaderboardOpen(false);
  };

  // Prevent body scrolling when leaderboard is open
  useEffect(() => {
    if (isLeaderboardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLeaderboardOpen]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div style={{ background: "#E2F5D2" }}>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 ">
          <div className="flex flex-col text-center w-full mb-10 relative">
            <button 
              className="absolute right-0 top-0 bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition duration-300 flex items-center"
              onClick={toggleLeaderboard}
            >
              <span>Leaderboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 11.586V6z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl py-3">
              Upcoming Campaigns
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed ">
              Empower change, ignite purpose! Join our upcoming campaigns as a
              volunteer, and let's weave the threads of impact together. Your
              time, passion, and dedication are the catalysts for a brighter
              tomorrow. Together, we can turn aspirations into actions and make
              a lasting difference in the world.
            </p>
          </div>
          <div className="my-5">
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
      
      {/* Sliding Leaderboard Component */}
      <Leaderboard 
        isOpen={isLeaderboardOpen} 
        onClose={closeLeaderboard} 
      />
      
      <ToastContainer />
      <Footer />
    </>
  );
}

export default Campaign;