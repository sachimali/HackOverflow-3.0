import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/cofig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VolunteerList() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [campaignExpired, setCampaignExpired] = useState(false);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const requestRef = doc(db, "requests", id);
        const requestData = await getDoc(requestRef);

        if (requestData.exists()) {
          setRequest(requestData.data());
        } else {
          console.log("Request not found");
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchRequestData();
  }, [id]);

  useEffect(() => {
    const fetchExpireDate = async () => {
      try {
        const requestRef = doc(db, "requests", id);
        const requestData = await getDoc(requestRef);

        if (requestData.exists()) {
          setRequest(requestData.data());
          const currentDate = new Date();
          const campaignEndDate = new Date(requestData.data().date);
          console.log(currentDate)
          console.log(campaignEndDate)

          if (currentDate > campaignEndDate) {
            setCampaignExpired(true);
          }
          console.log(campaignExpired)
        } else {
          console.log("Request not found");
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchExpireDate();
  }, [id]);

  useEffect(() => {
    const checkCertificates = async () => {
      if (request && Array.isArray(request.volunteers)) {
        const disabledButtons = await Promise.all(
          request.volunteers.map(async (volunteer) => {
            const username = volunteer.replace(/"/g, "");
            const userDocRef = doc(db, "users", username);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
              const userCertificates = userSnapshot.data().certificates || [];
              return userCertificates.includes(id);
            }
            return false;
          })
        );

        setDisabledButtons(disabledButtons);
      }
    };

    checkCertificates();
  }, [request, id]);

  const generateCertificate = async (volunteerUsername, index) => {
    try {
      const username = volunteerUsername.replace(/"/g, "");
      const userDocRef = doc(db, "users", username);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userCertificates = userSnapshot.data().certificates || [];

        if (userCertificates.includes(id)) {
          toast.warning(
            "Certificate already generated for this volunteer",
            1000
          );
          return;
        }

        await updateDoc(userDocRef, {
          certificates: arrayUnion(id),
        });

        toast.success("Certificate generated successfully", 1000);

        setGeneratedCertificates((prevCertificates) => [
          ...prevCertificates,
          index,
        ]);
        setDisabledButtons((prevDisabledButtons) => [
          ...prevDisabledButtons,
          index,
        ]);
      } else {
        toast.error("User not found", 1000);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };
  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex items-center justify-center text-sm">
        <div className="  w-3/4 mx-10  my-10 px-5 py-3  bg-white-100 rounded-lg shadow-lg">
          {request ? (
            <div>
              <h1 className="text-2xl text-green-600 font-bold mb-4">
                Campaign Details
              </h1>

              <p>
                <span className="text-lg font-bold mb-2">Campaign Title:</span>
                <span className="px-2 text-lg mb-2">
                  {request.campaignTitle}
                </span>
              </p>

              <p>
                <span className="text-lg font-bold mb-2">
                  Campaign Description:
                </span>
              </p>

              <p>
                <span className="px-2 text-lg mb-2">
                  {request.campaignDescription}
                </span>
              </p>

              <p>
                <span className="text-lg font-bold mb-2">Campaign Goals:</span>
                <span className="px-2 text-lg mb-2">
                  {request.campaignGoals}
                </span>
              </p>

              <p>
                <span className="text-lg font-bold mb-2">Address:</span>
                <span className="px-2 text-lg mb-2">{request.address}</span>
              </p>

              <p>
                <span className="text-lg font-bold mb-2">Date:</span>
                <span className="px-2 text-lg mb-2">{request.date}</span>
              </p>

              <p>
                <span className="text-lg font-bold mb-2">Start Time:</span>
                <span className="px-2 text-lg mb-2">{request.startTime}</span>
              </p>

              <p>
                <span className="text-lg font-bold mb-2">End Time:</span>
                <span className="px-2 text-lg mb-2">{request.endTime}</span>
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <div className="mx-10 my-10 px-10">
  {request &&
    Array.isArray(request.volunteers) &&
    request.volunteers.length > 0 ? (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Registered Volunteers</h2>
        <table className="w-full border border-collapse border-green-900">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="py-2 px-4 border border-green-500">Sr. No.</th>
              <th className="py-2 px-4 border border-green-500">Volunteers</th>
              {campaignExpired && (
                <th className="py-2 px-4 border border-green-500">
                  Generate Certificate
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {request.volunteers.map((volunteer, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-green-200" : "bg-green-100"}
              >
                <td className="py-2 px-4 border border-green-500">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border border-green-500">{volunteer}</td>
                {campaignExpired && (
                  <td className="py-2 px-4 border border-green-500">
                    <button
                      className={`py-1 px-2 rounded-md ${
                        generatedCertificates.includes(index) ||
                        disabledButtons[index]
                          ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                          : "bg-green-500 text-white"
                      }`}
                      onClick={() => generateCertificate(volunteer, index)}
                      disabled={
                        generatedCertificates.includes(index) ||
                        disabledButtons[index]
                      }
                    >
                      Generate
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="mt-8 text-center text-gray-500 font-bold text-2xl">
        <p>Hold tight, we're still waiting for volunteers to register.</p>
      </div>
    )}
</div>

    </>
  );
}
