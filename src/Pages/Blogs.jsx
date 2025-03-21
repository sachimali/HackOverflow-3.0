import React, { useEffect, useState } from "react";
import Readblog from "./Readblog";
import Header from "../Components/Navbar";
import { Link } from "react-router-dom";
import { db } from "../Firebase/cofig.js";
import {
  collection,
  getDocs,
  where,
  query,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import Footer from "../Components/Footer.jsx";
import Loader from "../Components/Loader.jsx";
import { AnimatePresence, motion } from "framer-motion";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(getFirestore(), "blogs"),
          where("status", "==", "approved")
        );
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div>
        <Header />
      </div>
      <div style={{ background: "#E2F5D2", height: "100vh" }} >
        <header className="">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 pt-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className=" sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Explore Blogs
                </h1>

                {/* <p className="mt-1.5 text-sm text-gray-500">
                  Discover fascinating insights about waste management and its
                  importance.
                </p> */}
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                  to="/addblog"
                >
                  <span className="text-sm font-medium"> Create Blogs </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="md:px-20 m-1 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
      <AnimatePresence>
        {blogs.map((blog,index) => (
          <motion.div
            key={blog.id}
            
            className="group relative m-3 flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-50 xl:h-80"
            initial={{
              opacity: 0,

              y: 50,
            }}
            whileHover={{scale:1.05}}


            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
                delay: index * 0.1,
              },
              animate: {
                opacity: 1,
                y: 0,
              },
            }}
            viewport={{ once: true}}
          >
            <Link
              to={`/readblog/${blog.id}`}
              className={`relative flex h-full ${
                selectedBlogId === blog.id ? 'selected' : ''
              }`}
              onClick={() => setSelectedBlogId(blog.id)}
            >
              <img
                src={blog.imglink}
                loading="lazy"
                alt={`Photo for ${blog.title}`}
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent md:via-transparent"></div>

              <div className="relative mt-auto p-4">
                <h2 className="mb-1 text-sm font-semibold text-white transition duration-100">
                  {blog.title}
                </h2>
                <p className="text-gray-300 text-sm mb-2">{blog.subtitle}</p>{" "}
                {/* Added subtitle here */}
                <span className="block text-sm text-gray-200">
                  {new Date(blog.timestamp.seconds * 1000).toLocaleString()}
                </span>
                <span className="font-semibold text-indigo-300">Read more</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
        
      </div>
    </>
  );
}
