import React, { useEffect, useState, useRef } from "react";
import Readblog from "./Readblog";
import Header from "../Components/Navbar.jsx";
import { Link } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "../Components/NotFound.jsx";
import {
  getStorage,
  deleteObject,
  ref,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import Loader from "../Components/Loader.jsx";

import { uploadBytes } from "firebase/storage";
import AdminRegister from "../Components/AdminRegister.jsx";
import Chart from "../Components/Chart.jsx";
import AdminTeam from "../Components/AdminTeam.jsx";
import AdminStats from "../Components/AdminStats.jsx";
import Feedback from "react-bootstrap/esm/Feedback.js";
import LeaderboardApp from "../Components/leaderboard.jsx";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const username = localStorage.getItem("username");
  const [activeTab, setActiveTab] = useState("blogs");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const targetRef = useRef();

  const handleScrollToElement = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    //code for blogs approval section
    try {
      const q = query(
        collection(getFirestore(), "blogs"),
        where("status", "==", "notapproved")
      );
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
      //   console.log(blog)

      // Code for Campign Request Section
      const campaignQuery = query(
        collection(getFirestore(), "requests"),
        where("approval", "==", "false")
      );
      const campaignSnapshot = await getDocs(campaignQuery);
      const campaignData = campaignSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCampaigns(campaignData);

      // Code for feedback Request Section
      const productQuery = query(
        collection(getFirestore(), "products"),
        where("approved", "==", false)
      );
      const productSnapshot = await getDocs(productQuery);
      const productData = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(productData);
      setProducts(productData);

      const feedbackQuery = query(
        collection(getFirestore(), "feedback"),
        where("approved", "==", false)
      );
      const feedbackSnapshot = await getDocs(feedbackQuery);
      const feedbackData = feedbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(productData);
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (blogId) => {
    try {
      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, {
        status: "approved",
      });

      // After updating the status, you may want to refetch the data or update the local state accordingly.
      fetchData();
      toast.success("Blog approved!", 1000);
    } catch (error) {
      console.error("Error approving blog:", error);
    }finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDiscard = async (blogId) => {
    try {
      const blogRef = doc(db, "blogs", blogId);
      await deleteDoc(blogRef);

      // After deleting the blog, you may want to refetch the data or update the local state accordingly.
      fetchData();
      toast.error("Blog discarded!", 1000);
    } catch (error) {
      console.error("Error discarding blog:", error);
    }finally {
      setLoading(false);
    }
  };

  const approveCampaign = async (campaignId, campaignDate) => {
    try {
      const blogRef = doc(db, "requests", campaignId);
      await updateDoc(blogRef, {
        approval: "true",
      });
      fetchData();
      toast.success("Campaign Successfully approved!", 1000);
      const campaignsCollectionRef = collection(db, "campaigns");
      const todayDocRef = doc(campaignsCollectionRef, campaignDate);
      const todayDocSnapshot = await getDoc(todayDocRef);

      if (todayDocSnapshot.exists()) {
        await updateDoc(todayDocRef, {
          count: increment(1),
          campaign_ids: arrayUnion(campaignId),
        });
      } else {
        await setDoc(todayDocRef, {
          count: 1,
          campaign_ids: [campaignId],
        });
      }
    } catch (error) {
      console.error("Error approving blog:", error);
    }finally {
      setLoading(false);
    }
  };

  const declineCampaign = async (campaignId) => {
    try {
      const blogRef = doc(db, "requests", campaignId);
      await updateDoc(blogRef, {
        approval: "rejected",
      });

      fetchData();
      toast.error("Campaign Successfully declined!", 1000);
    } catch (error) {
      console.error("Error approving blog:", error);
    }finally {
      setLoading(false);
    }
  };

  const approveProduct = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        approved: true,
      });

      fetchData();
      toast.success("Product approved!", 1000);
    } catch (error) {
      console.error("Error approving product:", error);
    }finally {
      setLoading(false);
    }
  };

  const discardProduct = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);

      fetchData();
      toast.error("product discarded!", 1000);
    } catch (error) {
      console.error("Error discarding product:", error);
    }finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (feedbackId) => {
    try {
      const feedbackRef = doc(db, "feedback", feedbackId);
      await updateDoc(feedbackRef, {
        approved: true,
      });

      fetchData();
      toast.success("feedback approved!", 1000);
    } catch (error) {
      console.error("Error approving feedback:", error);
    }finally {
      setLoading(false);
    }
  };

  const discardFeedback = async (feedbackId) => {
    try {
      const feedbackRef = doc(db, "feedback", feedbackId);
      await deleteDoc(feedbackRef);

      fetchData();
      toast.error("feedback discarded!", 1000);
    } catch (error) {
      console.error("Error discarding feedback:", error);
    }finally {
      setLoading(false);
    }
  };

  const [manualFile, setManualFile] = useState(null);
  const [manualImageFile, setManualImageFile] = useState(null);
  const [uploadingManual, setUploadingManual] = useState(false);
  const [manuals, setManuals] = useState([]);

  

  const fetchManuals = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, "manuals");
      const res = await listAll(storageRef);
      const promises = res.prefixes.map(async (folderRef) => {
        const fileList = await listAll(folderRef);
        const filePromises = fileList.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        });
        const files = await Promise.all(filePromises);
        return { name: folderRef.name, files };
      });
      const manuals = await Promise.all(promises);
      setManuals(manuals);
    } catch (error) {
      console.error("Error fetching manuals:", error);
    }finally {
      setLoading(false);
    }
  };

  const handleManualDelete = async (manualName) => {
    try {
      if (!manualName) {
        console.error("Manual name is undefined or null");
        toast.error("Manual name is undefined or null. Please try again.");
        return;
      }

      const storage = getStorage();
      const folderRef = ref(storage, `manuals/${manualName}`);

      const listResult = await listAll(folderRef);

      await Promise.all(
        listResult.items.map(async (item) => {
          await deleteObject(item);
        })
      );

      await deleteObject(folderRef);

      toast.success("Manual and its contents deleted successfully!");
      fetchManuals();
    } catch (error) {
      console.error("Error deleting manual: ", error);
      // if (error.code === "storage/object-not-found") {
      //   console.error(`Manual '${manualName}' not found.`);
      //   toast.error(`Manual '${manualName}' not found.`);
      // } else {
      //   console.error("Unknown error occurred while deleting manual.");
      //   toast.error(
      //     "Unknown error occurred while deleting manual. Please try again."
      //   );
      // }
      fetchManuals();
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  const [guideFile, setGuideFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingGuide, setUploadingGuide] = useState(false);
  const [guides, setGuides] = useState([]);

  const handleGuideChange = (e) => {
    const files = e.target.files;
    if (files.length === 1) {
      const file = files[0];
      if (file.type.includes("image")) {
        setImageFile(file);
      } else {
        setGuideFile(file);
      }
    }
  };

  const handleUploadGuide = async () => {
    try {
      if (!guideFile || !imageFile) {
        toast.error("Please select both a guide file and an image file.");
        return;
      }

      setUploadingGuide(true);

      const folderName = guideFile.name.replace(/\.[^/.]+$/, "");
      const storage = getStorage();
      const storageRef = ref(storage);
      const folderRef = ref(storageRef, `guides/${folderName}`);
      const guideFilePath = ref(folderRef, guideFile.name);
      const imageFilePath = ref(folderRef, imageFile.name);

      // Upload both files simultaneously
      await Promise.all([
        uploadBytes(guideFilePath, guideFile),
        uploadBytes(imageFilePath, imageFile),
      ]);

      setUploadingGuide(false);
      setGuideFile(null);
      setImageFile(null);
      toast.success("Guide and image uploaded successfully!");
      fetchGuides();
    } catch (error) {
      console.error("Error uploading guide and image: ", error);
      setUploadingGuide(false);
      toast.error("Error uploading guide and image. Please try again.");
    }finally {
      setLoading(false);
    }
  };

  const fetchGuides = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, "guides");
      const res = await listAll(storageRef);
      const promises = res.prefixes.map(async (folderRef) => {
        const fileList = await listAll(folderRef);
        const filePromises = fileList.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        });
        const files = await Promise.all(filePromises);
        return { name: folderRef.name, files };
      });
      const guides = await Promise.all(promises);
      setGuides(guides);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }finally {
      setLoading(false);
    }
  };

  const handleGuideDelete = async (folderName) => {
    try {
      if (!folderName) {
        console.error("Folder name is undefined or null");
        toast.error("Folder name is undefined or null. Please try again.");
        return;
      }
      console.log(folderName);
      const storage = getStorage();
      const folderRef = ref(storage, `guides/${folderName}`);

      // List all items (files and subfolders) in the folder
      const listResult = await listAll(folderRef);

      // Delete all items (files and subfolders) in the folder
      await Promise.all(
        listResult.items.map(async (item) => {
          await deleteObject(item);
        })
      );

      // Finally, delete the folder itself
      await deleteObject(folderRef);

      toast.success("Folder and its contents deleted successfully!");
      fetchGuides();
    } catch (error) {
      console.error("Error deleting folder: ", error);
      // {
      //   console.error("Unknown error occurred while deleting folder.");
      //   toast.error(
      //     "Unknown error occurred while deleting folder. Please try again."
      //   );
      // }
      fetchGuides();
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <ToastContainer />
      <div>
        <Header />
      </div>

      <header>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-center">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome Back, {username}!
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Discover fascinating insights about waste management and its
                importance.! 🎉
              </p>
            </div>

            
          </div>
        </div>
      </header>

      <AdminStats guides={guides.length} manuals={manuals.length}/>

      <LeaderboardApp />
      <div className="flex flex-col md:flex-row lg:px-32 md:px-32">
        <div className="md:flex bg-white w-11/12 md:w-6/12 mx-auto my-4 text-center">
          <div className=" md:w-11/12 mx-auto border-2 border-black rounded-lg h-full md:justify-end">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl py-6">
              Administration Team
              <AdminTeam />
            </h1>
          </div>
        </div>
      </div>

      <span className="flex items-center pb-4">
        <span className="h-px flex-1 bg-green-500"></span>
        <span className="h-px flex-1 bg-green-500"></span>
      </span>

      <div className="flex justify-center" ref={targetRef}>
        <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl text-center pb-4">
            Approval Section
          </h1>
          <fieldset className="flex flex-wrap gap-3 mb-3">
            <legend className="sr-only">Tab Options</legend>

            <div>
              <button
                className={`${
                  activeTab === "blogs"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("blogs")}
              >
                Blogs
              </button>
            </div>

            <div>
              <button
                className={`${
                  activeTab === "campaigns"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("campaigns")}
              >
                Campaigns
              </button>
            </div>

            <div>
              <button
                className={`${
                  activeTab === "products"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("products")}
              >
                Product Approval
              </button>
            </div>

            <div>
              <button
                className={`${
                  activeTab === "feedback"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("feedback")}
              >
                Feedback Approval
              </button>
            </div>

            {/* <div>
              <button
                className={`${
                  activeTab === "documents"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("documents")}
              >
                Document
              </button>
            </div> */}

            <div>
              <button
                className={`${
                  activeTab === "admin"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                } px-3 py-2 rounded-md transition duration-100 w-[10rem]`}
                onClick={() => handleTabChange("admin")}
              >
                Create Admin
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      {activeTab === "blogs" && (
        <section>
          {blogs.length === 0 ? (
            <NotFound />
          ) : (
            <div className=" m-10 lg:px-32  grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 ">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-96"
                >
                  <Link
                    key={blog.id}
                    to={`/readblog/${blog.id}`}
                    className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-96"
                  >
                    <img
                      src={blog.imglink}
                      loading="lazy"
                      alt={`Photo for ${blog.title}`}
                      className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent md:via-transparent"></div>

                    <div className="relative mt-auto p-4">
                      <h2 className="mb-1 text-xl font-semibold text-white transition duration-100">
                        {blog.title}
                      </h2>
                      <p className="text-gray-300 text-sm mb-2">
                        {blog.subtitle}
                      </p>{" "}
                      <span className="block text-sm text-gray-200">
                        {new Date(
                          blog.timestamp.seconds * 1000
                        ).toLocaleString()}
                      </span>
                      <span className="font-semibold text-indigo-300">
                        Read more
                      </span>
                    </div>
                  </Link>

                  <div className="m-8">
                    {blog.status === "notapproved" && (
                      <div className="absolute bottom-4 left-4 space-y-2">
                        <button
                          className="px-2 py-1 m-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                          onClick={() => handleApprove(blog.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 m-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                          onClick={() => handleDiscard(blog.id)}
                        >
                          Discard
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "campaigns" && (
        <section className="bg-white text-grey-900 container px-5 py-10 mx-auto">
          {campaigns.length === 0 ? (
            (<NotFound />)
          ) : (
            <div className="mx-auto max-w-screen-xl sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((req) => (
                  <div
                    className="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10 relative"
                    href="#"
                    key={req.id}
                  >
                    <div className="sm:flex sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                          {req.campaignTitle}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {`by ${req.userDetails.Fname} ${req.userDetails.Lname}`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-pretty text-sm text-gray-500">
                        {req.campaignDescription}
                      </p>
                    </div>

                    <dl className="mt-6 flex gap-4 sm:gap-6 pb-4">
                      <div className="flex flex-col-reverse flex-1">
                        <dt className="text-sm font-medium text-gray-600">
                          Date
                        </dt>
                        <dd className="text-xs text-gray-500">{req.date}</dd>
                      </div>

                      <div className="flex flex-col-reverse flex-1">
                        <dt className="text-sm font-medium text-gray-600">
                          Start time
                        </dt>
                        <dd className="text-xs text-gray-500">
                          {req.startTime}
                        </dd>
                      </div>
                      <div className="flex flex-col-reverse flex-1">
                        <dt className="text-sm font-medium text-gray-600">
                          End time
                        </dt>
                        <dd className="text-xs text-gray-500">{req.endTime}</dd>
                      </div>
                    </dl>

                    <div className="absolute bottom-0 left-0 right-0">
                      <span className="inline-flex -space-x-px overflow-hidden rounded-md bg-white shadow-sm w-full rounded-b-xl border">
                        <button
                          className="inline-block flex-1 px-4 py-2 text-sm font-medium text-gray-700  focus:relative bg-green-500 hover:bg-green-600"
                          onClick={() => approveCampaign(req.id, req.date)}
                        >
                          Approve
                        </button>
                        <button
                          className="inline-block flex-1 px-4 py-2 text-sm font-medium text-gray-700  focus:relative bg-red-500 hover:bg-red-600"
                          onClick={() => declineCampaign(req.id)}
                        >
                          Decline
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "products" && (
        <section>
          {products.length === 0 ? (
            (<NotFound />)
          ) : (
            <div className="mx-auto max-w-screen-xl sm:px-6 ">
              <div className="flex flex-wrap -my-4 py-10">
                {products.map((product) => (
                  <div
                    className="lg:w-1/4 md:w-1/2 p-4  w-full"
                    key={product.id}
                  >
                    <div className="rounded-lg overflow-hidden px-2 py-4 shadow-md hover:shadow-xl">
                      <a className="block relative h-48 rounded overflow-hidden">
                        <img
                          alt="Product"
                          className="object-cover object-center w-full h-full block"
                          src={product.imageUrl}
                        />
                      </a>
                      <div className="mt-4">
                        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                          {product.category}
                        </h3>
                        <h2 className="text-gray-900 title-font text-lg font-medium">
                          {product.name}
                        </h2>
                        <p className="mt-1">${product.price}</p>
                      </div>

                      <div className="px-6">
                        <button
                          onClick={() =>
                            (window.location.href = product.affiliatedlink)
                          }
                          className="m-1 px-4 py-1 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Shop Now
                        </button>
                        {product.approved === false && (
                          <div className=" bottom-4 left-4 space-y-2">
                            <button
                              className="px-2 py-1 m-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                              onClick={() => approveProduct(product.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1  m-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                              onClick={() => discardProduct(product.id)}
                            >
                              Discard
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "feedback" && (
        <section className="m-3">
          {feedbacks.length === 0 ? (
            <NotFound />
          ) : (
            <div className="flex flex-col py-10 lg:px-32  align-middle items-center snap-center snap-always">
              {feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="m-3 bg-white rounded-lg shadow-lg p-6"
                  style={{ animationDelay: `${index * 0.2}s` }} // Delay animation for each card
                >
                  <svg
                    className="h-12 mx-auto mb-3 text-green-400 dark:text-green-600"
                    viewBox="0 0 24 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <blockquote>
                    <p className="text-sm font-medium text-green-900 md:text-sm">
                      {feedback.content}
                    </p>
                  </blockquote>
                  <figcaption className="flex items-center justify-center mt-6 space-x-3">
                    <img
                      className="w-6 h-6 rounded-full"
                      src={feedback.imgLink}
                      alt="profile picture"
                    />
                    <div className="flex items-center divide-x-2 divide-green-500 ">
                      <div className="pr-3 font-medium text-gray-900 ">
                        {feedback.authname}
                      </div>
                    </div>

                    {feedback.approved === false && (
                      <div className=" bottom-4 left-4 space-y-2">
                        <button
                          className="px-2 py-1 m-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                          onClick={() => approveFeedback(feedback.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1  m-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                          onClick={() => discardFeedback(feedback.id)}
                        >
                          Discard
                        </button>
                      </div>
                    )}
                  </figcaption>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "admin" && <AdminRegister />}

      {activeTab === "documents" && (
        <section className="container mx-auto lg:px-32 px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between mb-4 lg:px-32 border-b ">
            {/* Document Upload Section */}
            <div className="mb-4 lg:mr-4 lg:w-1/2 ">
              <h2 className="text-lg font-bold mb-2 flex justify-center">Upload Manuals</h2>
              <div className="  p-2">
                <div className="flex  items-center flex-col lg:flex-row justify-center bg-grey-lighter">
                  <div className="p-2">
                    <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-green-500">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-base leading-normal">
                        Select file
                      </span>
                      <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                    </label>
                  </div>
                  <div className="px-2">
                    <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-green-500">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-base leading-normal">
                        Select image
                      </span>
                      <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
              <button
                onClick={handleUploadManual}
                disabled={uploadingManual}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2"
              >
                {uploadingManual ? "Uploading..." : "Upload Manual"}
              </button>
              </div>
            </div>
          

            {/* Guide Upload Section */}
            <div className="mb-4 lg:mr-4 lg:w-1/2 ">
              <h2 className="text-lg font-bold mb-2 flex justify-center">Upload Guide</h2>
              <div className="  p-2">
                <div className="flex  items-center justify-center flex-col lg:flex-row bg-grey-lighter">
                  <div className="p-2">
                    <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-green-500">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-base leading-normal">
                        Select file
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleGuideChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="px-2">
                    <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-green-500">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-base leading-normal">
                        Select image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGuideChange}
                        className="hidden "
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
              <button
                onClick={handleUploadGuide}
                disabled={uploadingGuide}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 "
              >
                {uploadingGuide ? "Uploading..." : "Upload Guide"}
              </button>
              </div>
            </div>
          </div>

          {/* Document List Section */}
          <div className="lg:px-32 border-b border-gray-300">
            <h2 className="text-lg font-bold mb-2">Manuals</h2>
            {manuals.length === 0 ? (
              <NotFound />
            ) : (
              <ul className="space-y-4    ">
                {manuals.map((manual, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-4 lg:px-0 lg:flex-row flex-col my-2 border rounded-md px-4 shadow-md hover:shadow-xl"
                  >
                    <h3>{manual.name}</h3>
                    {manual.files.map((file, index) => (
                      <div key={index}
                      className="flex  items-center justify-center flex-col  ">
                        <p className="text-blue-500 py-3"> {file.name}</p>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600  "
                        >
                          View File
                        </a>
                      </div>
                    ))}
                    <button
                      onClick={() => handleManualDelete(manual.name)}
                      className="text-red-500 hover:text-red-700 m-3"
                    >
                      Delete Manual
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Guide List Section */}
          <div className="lg:px-32 my-4">
            <h2 className="text-lg font-bold mb-2">Guides</h2>
            {guides.length === 0 ? (
              <NotFound />
            ) : (
              <ul className="space-y-4  ">
                {guides.map((guide, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-4 lg:px-0 lg:flex-row flex-col my-2 border rounded-md px-4  shadow-md hover:shadow-xl"
                  >
                    <h3>{guide.name}</h3>
                    {guide.files.map((file, index) => (
                      <div key={index} className="flex  items-center justify-center flex-col ">
                        <p className="text-blue-500 py-3"> {file.name}</p>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600  "
                        >
                          View File
                        </a>
                      </div>
                    ))}
                    <button
                      onClick={() => handleGuideDelete(guide.name)}
                      className="text-red-500 hover:text-red-700 m-3"
                    >
                      Delete Guide
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </>
  );
}
