import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from '../Firebase/cofig.js'
import { doc, getDoc } from "firebase/firestore";
import { IonIcon } from "@ionic/react";
import { mailOutline, personOutline } from "ionicons/icons";
import Navbar from "../Components/Navbar.jsx";

const Readblog = () => {
  const { id } = useParams(); // Extract id from URL params
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = await getDoc(doc(db, "blogs", id));
        if (blogDoc.exists()) {
          setBlog(blogDoc.data());
        } else {
          console.error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>; // or show a loading spinner
  }
  return (
    <>
    <Navbar />
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-md px-4 md:px-8">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6">
            {blog.title}
          </h1>
          <h1 className="mb-4 text-center text-lg font-semibold text-gray-400 italic sm:text-xl md:mb-6">
            {blog.subtitle}
          </h1>

          <div className="relative mb-6 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:mb-8">
            <img
              src={blog.imglink}
              loading="lazy"
              alt={`${blog.title}`}
              className="h-full w-full object-cover object-center"
            />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4">
            Blog
          </h2>

          <p className="mb-6 text-gray-500 max-w-screen-xl text-justify sm:text-lg md:mb-8 border-l-4 border-green-800 p-4">{blog.blogContent}</p>

          {/* <blockquote className="mb-6 border-l-4 pl-4 italic text-gray-500 sm:text-lg md:mb-8 md:pl-6">
            {blog.quote}
          </blockquote> */}

          <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 align-middle items-center flex ">
            <IonIcon icon={personOutline} className="p-2"></IonIcon>
            <span className="text-lg text-green-800"> {blog.authname} </span>
          </h2>
          <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 align-middle items-center flex">
            <IonIcon icon={mailOutline} className="p-2"></IonIcon>
            <span className="text-lg text-green-800">{blog.email}</span>
          </h2>

          <p className="text-gray-500 sm:text-md">Published on: {new Date(blog.timestamp.seconds * 1000).toLocaleString()}</p>

        </div>
      </div>
    </>
  );
}

export default Readblog;
