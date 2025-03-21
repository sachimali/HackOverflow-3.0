import React, { useState, useEffect } from "react";
import { db } from "../Firebase/cofig.js";
import {
  collection,
  getDocs,
  where,
  query,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function AdminTeam() {
  const [admin, setAdmin] = useState([]);
  const fetchData = async () => {
    const q = query(collection(getFirestore(), "admin"));
    const querySnapshot = await getDocs(q);
    const adminData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAdmin(adminData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4 w-8/12 mx-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm overflow-y-auto">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-bold text-gray-900">
                Username
              </th>
            </tr>
          </thead>

          {admin.map((data) => (
            <tbody className="divide-y divide-gray-200  hover:bg-gray-200">
              <tr>
                <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-700">
                  {data.Fname} {data.Lname}
                </td>
                <td className="whitespace-nowrap px-2 py-2 font-medium text-neutral-700">
                  {data.id}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}

export default AdminTeam;
