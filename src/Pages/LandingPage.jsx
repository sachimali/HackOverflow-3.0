import React, { useState } from "react";
import Banner from "../Components/Banner";
import StatsView from "../Components/StatsView";
import Footer from "../Components/Footer";
import Products from "../Components/Products";
import Blogs from "../Components/Blogs";
import Navbar from "../Components/Navbar";
import Testimonial from "../Components/Testimonial";
import Services from "../Components/About-Us/Services";

function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      {(
        <>
          <Navbar />
          <Banner />
          <StatsView />
          <Services />
          <Products />
          <Blogs />
          <Testimonial/>
          
        </>
      )}
    </div>
  );
}

export default LandingPage;
