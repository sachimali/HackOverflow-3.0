import React, { useEffect, useState } from "react";
import { db } from "../Firebase/cofig.js";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../Components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import UserProfile from "../Components/UserDetails.jsx"

export default function UserDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    alert("Delete functionality will be implemented here");
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  useEffect(() => {
    const loadUserData = async () => {
      const username = localStorage.getItem("username");

      if (username) {
        const isAdmin = localStorage.getItem("isAdmin") === "true";

        if (isAdmin) {
          // Fetch data from the admin collection
          const adminDocumentRef = doc(db, "admin", username);

          try {
            const adminDocSnap = await getDoc(adminDocumentRef);

            if (adminDocSnap.exists()) {
              const adminData = adminDocSnap.data();
              setUserData(adminData);
            } else {
              console.log("Admin document does not exist");
            }
          } catch (error) {
            console.error("Error fetching admin data:", error);
          } finally {
            setLoading(false);
          }
        } else {
          // Fetch data from the users collection
          const userDocumentRef = doc(db, "users", username);

          try {
            const userDocSnap = await getDoc(userDocumentRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserData(userData);
            } else {
              console.log("User document does not exist");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    loadUserData();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Timestamp not available";
    }

    try {
      const dateObject = timestamp.toDate();
      return dateObject.toLocaleString();
    } catch (error) {
      console.error("Error converting timestamp:", error);
      return "Invalid Timestamp";
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="flex items-center justify-start ml-16">
        <div className=" p-8 max-w-md w-full">
          <div className="flow-root rounded-lg border ">
            <dl className="my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">Username</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {localStorage.getItem("username")}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">Name</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {userData.Fname + " " + userData.Lname}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">Aadhar Number</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {userData.aadharNumber}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">Date of Birth</dt>
                <dd className="text-gray-700 sm:col-span-2">{userData.dob}</dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">Contact</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {userData.phone}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">State</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {userData.state}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">City</dt>
                <dd className="text-gray-700 sm:col-span-2">{userData.city}</dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">Email</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {userData.email}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 hover:bg-gray-200 sm:gap-4">
                <dt className="font-medium text-gray-900">User Since</dt>
                <dd className="text-gray-700 sm:col-span-2">
                  {formatTimestamp(userData.createdAt)}
                </dd>
              </div>

              <div className="mt-3 mx-3 flex items-center justify-center">

                <button
                  className="group relative flex items-center justify-center rounded bg-green-500 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500  mr-4"
                  onClick={logout}
                >
                  <span className="absolute -start-full transition-all group-hover:start-4">
                    <svg
                      className="size-5 rtl:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium transition-all group-hover:ms-4">
                    Logout
                  </span>
                </button>

                <Link to="/feedbacks" className="no-underline">
                  <button className="group relative flex items-center justify-center rounded bg-green-500 px-8 py-3 text-white focus:outline-none focus:ring active:bg-green-500 mx-auto no-underline">
                    Feedback
                  </button>
                </Link>

              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
