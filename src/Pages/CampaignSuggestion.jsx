import React, { useEffect, useState } from "react";
import { db } from "../Firebase/cofig";
import { collection, query, getDocs } from "firebase/firestore";

const CampaignSuggestions = () => {
  const [reports, setReports] = useState([]);

  // useEffect(() => {
  //   const fetchReports = async () => {
  //     try {
  //       const reportsCollectionRef = collection(db, "awaiting-reports", "Kalyan", "19.2463");
  //       const reportsQuery = query(reportsCollectionRef);
  //       const reportsSnapshot = await getDocs(reportsQuery);

  //       const reportsData = reportsSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       console.log("Reports Data:", reportsData);
  //       setReports(reportsData);
  //     } catch (error) {
  //       console.error("Error fetching reports:", error);
  //     }
  //   };

  //   fetchReports();
  // }, []);

  return (
    <div className="flex flex-wrap -m-4">
      {reports.map((report) => (
        <div key={report.id} className="p-4 w-full md:w-1/2 lg:w-1/3">
          <div className="border border-gray-300 rounded p-6">
            <h2 className="text-xl font-semibold mb-4">
              {report.Fname} {report.Lname}
            </h2>
            <p className="text-gray-600 mb-2">{report.description}</p>
            <p className="text-gray-600 mb-2">{report.email}</p>
            <p className="text-gray-600 mb-2">{report.phone}</p>
            <p className="text-gray-600 mb-2">
              {report.state}, {report.city}
            </p>
            <a
              href={report.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Location
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignSuggestions;
