import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Campaign from "./../Pages/Campaign";
import Logo from "./../assets/Ecodarkgreen.png";
import LogoL from "./../assets/Ecolightgreen.png";

function Navbar() {
  const [hasEmail, sethasEmail] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleClickProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    const isUser = localStorage.getItem("isAdmin");
    setIsAdmin(isUser === "true");
    sethasEmail(!!storedEmail);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleExtra = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className="border-b border-gray-700 md:border-b-0 md:border-none"
      // style={{ background: "#C5EBA8" }}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
      <div className="flex h-16 items-center justify-between md:border-b-2 md:border-gray-200">
         <div className="flex-1 md:flex md:items-center md:gap-12 flex item-center">
         <Link
           to="/"
           className="ml-3 text-xl  hover:text-green-500"
           style={{ textDecoration: "none" }}
         >
           <a
           className="flex font-medium items-center justify-center hover:text-green-500 text-gray-900  md:mb-0"
           style={{ textDecoration: "none" }}
           >              
           <img 
             className="w-11 h-11 text-white mix-blend-darken" 
             id="logo"
             src={Logo} 
             alt="" 
             srcSet="" 
             // onMouseOver={e => e.currentTarget.src = LogoL} 
             // onMouseOut={e => e.currentTarget.src = Logo}
           />
           <span
             className="text-3xl text-[#02391e]  hover:text-[#99e631] italic font-bold"
             style={{ textDecoration: "none" }}
             onMouseOver={() => document.getElementById('logo').src = LogoL}
             onMouseOut={() => document.getElementById('logo').src = Logo}
           >
             EcoWise
           </span>
           </a>
         </Link>
         </div>
 
         <div className="md:flex md:items-center md:gap-12">
         <nav aria-label="Global" className="hidden md:block">
           <ul className="flex items-center gap-6 text-sm uppercase">
           {/* <li>
             <a>
             {" "}
            <Link
              to="/about"
              className="text-gray-500 hover:text-green-500"
              style={{ textDecoration: "none" }}
            >
              About
            </Link>{" "}
            </a>
          </li> */}

          <li>
            <a>
            {" "}
            <Link
              to="/ecommerce"
              className="text-gray-500 hover:text-green-500"
              style={{ textDecoration: "none" }}
            >
              Products
            </Link>{" "}
            </a>
          </li>

                <li>
                  <a>
                    {" "}
                    <Link
                      to="/blogs"
                      className="text-gray-500 hover:text-green-500"
                      style={{ textDecoration: "none" }}
                    >
                      Blogs
                    </Link>{" "}
                  </a>
                </li>
                <li>
                  <a>
                    {" "}
                    <Link
                      to="/campaign"
                      className="text-gray-500 hover:text-green-500"
                      style={{ textDecoration: "none" }}
                    >
                      Campaigns
                    </Link>{" "}
                  </a>
                </li>
                {/* <li>
                  <a>
                    {" "}
                    <Link
                      to="/guideline"
                      className="text-gray-500 hover:text-green-500"
                      style={{ textDecoration: "none" }}
                    >
                      Guides
                    </Link>{" "}
                  </a>
                </li> */}
                <li>
                  <div className="relative">
                    <div
                      className="inline-flex items-center overflow-hidden rounded-md   px-2"
                      onClick={toggleExtra}
                      // style={{ background: "#C5EBAA" }}
                    >
                      <a
                        href="#"
                        className="text-gray-500 hover:text-green-500 "
                        style={{ textDecoration: "none" }}
                      >
                        More
                        <button className="h-full px-2 text-gray-500 hover:text-green-500">
                          <span className="sr-only">Menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </a>
                    </div>
                    {isOpen && (
                      <div
                        className="absolute end-0 z-10 mt-2 w-40 rounded-md border border-gray-100 bg-white shadow-lg"
                        role="menu"
                      >
                        <li>
                          <Link
                            to="/"
                            className="block py-2 px-4 text-gray-700 hover:text-green-500"
                            style={{ textDecoration: "none" }}
                          >
                            Waste Classification Model
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/maps"
                            className="block py-2 px-4 text-gray-700 hover:text-green-500"
                            style={{ textDecoration: "none" }}
                          >
                            Bin Locator
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/footprint"
                            className="block py-2 px-4 text-gray-700 hover:text-green-500"
                            style={{ textDecoration: "none" }}
                          >
                            Carbon Footprint
                          </Link>
                        </li>
                        
                        
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {hasEmail ? (
                isAdmin ? (
                  <div className="sm:flex sm:gap-4 ">
                    <Link to="/admin" className="flex items-center">
                      <a className="rounded-md bg-[#02391e] lg:px-5 py-2.5 text-sm font-medium text-white shadow hidden md:block">
                        Dashboard
                      </a>
                    </Link>
                    <Link to="/profile" className="flex items-center">
                      <a className="rounded-md bg-[#02391e] lg:px-5 px-3 py-2.5 text-sm font-medium text-white shadow">
                        Profile
                      </a>
                    </Link>
                  </div>
                ) : (
                  <div className="sm:flex sm:gap-4">
                    <Link to="/profile" className="flex items-center">
                      <a className="rounded-md bg-green-500 lg:px-5 px-3 py-2.5 text-sm font-medium text-white shadow">
                        Profile
                      </a>
                    </Link>
                  </div>
                )
              ) : (
                <div className="sm:flex sm:gap-4">
                  <Link to="/login" className="flex items-center">
                    <a className="rounded-md bg-green-500 lg:px-5 px-3 py-2.5 text-sm font-medium text-white shadow">
                      Login
                    </a>
                  </Link>
                </div>
              )}

              <div className="block md:hidden">
                <button
                  className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={closeMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ecommerce"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Products
                  </Link>
                </li>

                <li>
                  <a className="text-gray-500 transition hover:text-gray-500/75">
                    {" "}
                    <Link to="/blogs">Blogs</Link>{" "}
                  </a>
                </li>
                <li>
                  <Link
                    to="/campaign"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guideline"
                    className="text-gray-500 hover:text-gray-700 "
                    onClick={closeMenu}
                  >
                    Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/maps"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Maps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/footprint"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Carbon Footprint
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requestcampaign"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Request Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    to="/report"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeMenu}
                  >
                    Report Dumpgrounds
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
