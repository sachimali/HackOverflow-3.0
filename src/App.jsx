// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
// import Header from "./Components/Header";
import LandingPage from "./Pages/LandingPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import AboutPage from "./Pages/AboutPage";
import Ecommerce from "./Pages/Ecommerce";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import SignUpPage from "./Pages/SignUpPage";
// import Stats from "./Pages/Stats";
import Report from "./Pages/Report";
// import GuidelinesPage from "./Pages/GuidelinesPage";
import Blogs from "./Pages/Blogs";
import Readblog from "./Pages/Readblog";
import AddBlog from "./Pages/Addblog";
import Admin from "./Pages/Admin";
import UserProfile from "./Pages/UserProfile";
import RequestCampaign from "./Pages/RequestCampaign";
import Registration from "./Pages/Registration";
import Maps from "./Components/Maps";
// import Loader from "./Components/Loader";
import Footprint from "./Pages/FootPrint";
import Campaign from "./Pages/Campaign";
import ProtectedRoute from "./Components/ProtectedRoute";
import VolunteerList from "./Pages/VolunteerList";
import Certificate from "./Components/Certificate";
import RequestProduct from "./Pages/RequestProduct";
import AdminRoute from "./Components/AdminRoute";
import CampaignSuggestion from "./Pages/CampaignSuggestion";
import "bootstrap/dist/css/bootstrap.min.css";
import Error from "./Pages/Error";
import Feedbacks from "./Pages/Feedbacks";

function App() {
  // const [count, setCount] = useState(0);
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute user={username} route="/login">
                <Registration />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/report" element={<Report />} />
          
          <Route path="/blogs" element={<Blogs />} />
          <Route
            path="/readblog/:id"
            element={
              <ProtectedRoute user={username} route="/login">
                <Readblog />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/addblog"
            element={
              <ProtectedRoute user={username} route="/login">
                <AddBlog />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={username} route="/login">
                <UserProfile />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/requestcampaign"
            element={
              <ProtectedRoute user={username} route="/login">
                <RequestCampaign />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/maps"
            element={
              <ProtectedRoute user={username} route="/login">
                <Maps />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/requestproduct"
            element={
              <ProtectedRoute user={username} route="/login">
                <RequestProduct />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/footprint"
            element={
              <ProtectedRoute user={username} route="/login">
                <Footprint />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate"
            element={
              <ProtectedRoute user={username} route="/login">
                <Certificate />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedbacks"
            element={
              <ProtectedRoute user={username} route="/login">
                <Feedbacks />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute user={isAdmin} route="/login">
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/campaign/:id"
            element={
              <ProtectedRoute user={username} route="/login">
                <VolunteerList />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaignsuggestions"
            element={
              <ProtectedRoute user={username} route="/login">
                <CampaignSuggestion />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign"
            element={
              <ProtectedRoute user={username} route="/login">
                <Campaign />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
