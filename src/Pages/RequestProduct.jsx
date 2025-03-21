import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/cofig.js";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

const RequestProduct = () => {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const [affiliatedlink, setaffiliatedlink] = useState("");
  const [category, setcategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const useremail = localStorage.getItem("email");

    // Validate required fields
    const name = formData.get("name");
    const price = formData.get("price");
    const imageUrl = formData.get("imageUrl");
    const category = formData.get("category");
    const affiliatedlink = formData.get("affiliatedlink");

    if (!name || !price || !imageUrl || !category || !affiliatedlink) {
      alert("Please fill out all required fields.");
      return;
    }

    const productData = {
      name,
      price,
      category,
      useremail: useremail,
      timestamp: serverTimestamp(),
      imageUrl: imageUrl,
      affiliatedlink: affiliatedlink,
      approved: false,
    };

    try {
      await addDoc(collection(db, "products"), productData);
      alert("Your product will be added once admin approves it");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while adding the product.");
    }
  };
  return (
    <>
      <Navbar />
      <div className="bg-white py-6 sm:py-8 lg:py-12 mx-2 md:mx-4">
        <div className="mx-auto max-w-screen-md">
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-800 md:mb-6 lg:text-4xl">
              Add Your Own Ecofriendly product!
            </h2>
            <form
              className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2 mt-4"
              onSubmit={handleSubmit}
            >
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Name of the product
                </label>
                <input
                  name="name"
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Price of the product (in rupees)
                </label>
                <input
                  name="price"
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                  value={price}
                  onChange={(e) => setprice(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="imageUrl"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Paste Image Link
                </label>
                <input
                  name="imageUrl"
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                  value={imageUrl}
                  onChange={(e) => setimageUrl(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="affiliatedlink"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Affiliated Link
                </label>
                <input
                  name="affiliatedlink"
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                  value={affiliatedlink}
                  onChange={(e) => setaffiliatedlink(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="category"
                  className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
                >
                  Category
                </label>
                <input
                  name="category"
                  className="w-full rounded border bg-gray-50 px-2 py-1 text-gray-800 outline-none ring-green-300 transition duration-100 focus:ring"
                  value={category}
                  onChange={(e) => setcategory(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between sm:col-span-2 mt-4">
                <button
                  type="submit"
                  className="inline-block rounded-lg bg-green-500 px-6 py-3 text-center text-sm font-semibold text-white outline-none ring-green-300 transition duration-100 hover:bg-green-600 focus-visible:ring active:bg-green-700 md:text-base"
                >
                  Submit
                </button>

                
              </div>

              
            </form>
          </div>
        </div>
      </div>


      <div>
      </div>
    </>
  );
};

export default RequestProduct;
