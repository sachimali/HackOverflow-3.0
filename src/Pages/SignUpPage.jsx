import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../Firebase/cofig.js";
import Navbar from "./../Components/Navbar";
import Footer from "./../Components/Footer";

function SignUpPage() {
  // User Input Collection
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'
  const navigate = useNavigate();
  const auth = getAuth();

  // User Creation in Firebase Authentication
  const handleAddUser = async () => {
    try {
      // Validate inputs
      // if (
      //   userName.trim() !== "" &&
      //   email.trim() !== "" &&
      //   password.trim() !== ""
      // ) {
      if (password === confirmPassword) {
          // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

          // Add user details to Firestore
          // Preparing User Data for Firestore
        const userDetails = {
          userName: userName,
          email: email,
          role: role,
          createdAt: serverTimestamp(),
          password: password,
        };

        // Store user details in Firestore
        await setDoc(doc(db, "users", userName), userDetails);
        
        console.log("User successfully signed up:");
        toast("Successfully signed up")
        navigate("/register", {
          state: {
            userName: userName,
            email: email,
            password: password,
            role: role,
          },
      });
      } else {
        alert("Passwords do not match!");
      }
    } catch (error) {
        console.error("Error during email/password sign up:", error.message);
        toast("Error during sign up. Please try again.");
    }
  };


  const handleUserNameChange = (e) => {
    const value = e.target.value;
    if (value.includes(" ")) {
      alert("Username should not contain spaces.");
    } else {
      setUserName(value);
    }
  };

  return (
    <div className="overflow-hidden">
      <div>
        <Navbar />
      </div>
      <div
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1572248525483-6a953490f4b5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          backgroundSize: "cover",
        }}
      >
        <div className="py-4 sm:py-6 lg:py-8 w-screen h-screen flex justify-center items-center sm:px-4">
          <div className="bg-white/60 max-w-md py-4 px-4 rounded-lg md:px-8 shadow-lg shadow-slate-200 sm:w-full">
            <form className="mx-auto max-w-lg rounded-lg border border-teal-400 ">
              <div className="flex flex-col gap-4 p-2 md:p-6">
                <div>
                  <label
                    htmlFor="user-name"
                    className="mb-2 inline-block text-sm text-teal-800 sm:text-base"
                  >
                    User name
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    value={userName}
                    onChange={handleUserNameChange}
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-teal-800 outline-none ring-teal-500 transition duration-100 focus:ring"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 inline-block text-sm text-teal-800 sm:text-base"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-teal-500 transition duration-100 focus:ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 inline-block text-sm text-teal-800 sm:text-base"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-teal-500 transition duration-100 focus:ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 inline-block text-sm text-teal-800 sm:text-base"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-teal-500 transition duration-100 focus:ring"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddUser}
                  className="block rounded-lg bg-teal-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-teal-500 transition duration-100 hover:bg-teal-700 focus-visible:ring active:bg-teal-600 md:text-base"
                >
                  Sign up
                </button>
              </div>

              <div className="flex items-center justify-center bg-teal-100 p-4">
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login">
                    {" "}
                    <a
                      href="#"
                      className="text-teal-500 transition duration-100 hover:text-teal-600 active:text-teal-700"
                    >
                      Login
                    </a>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUpPage;

