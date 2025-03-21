import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase/cofig";
import { collection, getDocs, where, query } from "firebase/firestore";
import NotFound from "./NotFound";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const email = localStorage.getItem("email"); // Fetch email from local storage
  // console.log(email);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "blogs"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, [email]);

  const [filterType, setFilterType] = useState("all");

  const filteredBlogs = blogs.filter((blog) => {
    if (filterType === "all") {
      return true;
    } else if (filterType === "approved") {
      return blog.status === "approved";
    } else if (filterType === "notApproved") {
      return blog.status !== "approved";
    }
    return true;
  });

  return (
    <>
      <div className="bg-white py-3 sm:py-9 lg:py-12 ">
        <div className="mx-auto max-w-screen-2xl px-2 md:px-8">
          <div className="md:mb-1">
            <h2 className="text-center text-2xl font-bold text-gray-800 md:mb-3 lg:text-3xl">
              Discover Your Stories
            </h2>

            
          </div>

          <div>
            <div className=" flex items-center justify-center">
              <label className="block mr-2 text-sm font-medium text-gray-700">
                Filter By:
              </label>
              <select
                className="mt-1 p-2 border border-black rounded-md bg-white-300 py-1 px-4 focus:outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="notApproved">Not Approved</option>
              </select>
            </div>

            {blogs.length === 0 ? (
              <>
                <body className="flex flex-col justify-center items-center py-4 ">
                  <div className="flex flex-col items-center">
                    <NotFound/>
                    <p className="text-2xl font-medium text-gray-600 mb-6">
                      Looks like you have not published any blogs yet!!!
                    </p>
                    <Link
                      to="/addblog"
                      class="px-4 py-2 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-all duration-200 ease-in-out"
                    >
                      Add Blog
                    </Link>
                  </div>
                </body>
              </>
            ) : (
            
              <div className="mx-8 grid gap-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 mt-12 py-4">
              {/* // <div className="mx-32 md:mx-2 grid gap-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 mt-12 py-4"> */}

              
                {filteredBlogs.map((blog) => (
                  
                  <Link
                    key={blog.id}
                    to={`/readblog/${blog.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-lg  h-60 bg-gray-100 shadow-lg  xl:h-80"
                  >
                    <img
                      src={blog.imglink}
                      loading="lazy"
                      alt={`${blog.title}`}
                      className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent md:via-transparent"></div>

                    <div className="relative mt-auto p-4">
                      <span className="block text-sm text-gray-200">
                        {blog.date}
                      </span>
                      <h2 className="mb-2 text-xl font-semibold text-white transition duration-100">
                        {blog.title}
                      </h2>

                      <span className="font-semibold text-indigo-300">
                        Read more
                      </span>
                    </div>
                  </Link>

                
                ))}
              </div>
             
            )}
          </div>

          <div className="flex items-center justify-between sm:col-span-2">
            {/* <span className="text-sm text-gray-500">*Required</span> */}
          </div>
        </div>
      </div>
    </>
  );
}
