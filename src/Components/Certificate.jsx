import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};
  const userProps = location.state?.userProps || {};
  const campaignProps = location.state?.campaignProps || {};

  // Destructure the userProps and campaignProps objects as needed
  const { firstName, lastName } = userProps;
  const { campaignTitle, city, date, hostName } = campaignProps;

  useEffect(() => {
    window.print();
    navigate("/profile");
    const handleAfterPrint = () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [navigate]);

  useEffect(() => {
    // console.log('Received Props:', userProps, campaignProps);
  }, [userProps, campaignProps]);

  return (
    <div className="Receipt">
      {/* Your enhanced JSX code */}
      <section className=" border border-green-500  p-8 px-10 max-w-2xl mx-auto my-12 bg-white shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">
            Certificate of Appreciation
          </h2>
          <p className="mt-4 text-gray-500">is proudly presented to </p>
          <p className="mt-2 text-gray-700 font-semibold">
            {firstName} {lastName}
          </p>
          <p className="mt-2 text-gray-500">
            for volunteering for {campaignTitle}
          </p>
          <p className="mt-2 text-gray-500">
            held at {city} on {date}
          </p>
        </div>

        <div>
          <p className="mt-6 text-gray-500 italic text-center">
            "In grateful appreciation for your dedication and valuable
            contribution as a volunteer."
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block border border-green-700 bg-green-700 rounded px-8 py-3 text-sm font-medium text-white transition focus:outline-none focus:ring focus:ring-green-500">
            Hosted by {hostName}
          </div>
        </div>

        {/* Logo section */}
        <div className="mt-8 flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 375 374.999991"
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
            className="rounded-full w-10 h-10 "
          >
            <defs>
              <clipPath id="fb66969001">
                <path
                  d="M 12.023438 83.3125 L 363 83.3125 L 363 291.8125 L 12.023438 291.8125 Z M 12.023438 83.3125 "
                  clipRule="nonzero"
                />
              </clipPath>
            </defs>
            <g clipPath="url(#fb66969001)">
              <path
                fill="#00bf63"
                d="M 12.164062 83.3125 L 133.707031 291.683594 L 187.5 198.964844 L 241.503906 291.683594 L 362.835938 83.3125 L 284.496094 83.3125 L 228.179688 180.308594 L 239.609375 200.015625 L 295.929688 103.4375 L 328.121094 103.4375 L 241.503906 251.84375 L 199.140625 179.253906 L 255.039062 83.3125 L 231.753906 83.3125 L 187.5 159.335938 L 143.246094 83.3125 L 120.171875 83.3125 L 176.066406 179.253906 L 133.707031 251.84375 L 47.089844 103.4375 L 76.546875 103.4375 L 132.863281 200.015625 L 144.507812 180.308594 L 87.976562 83.3125 Z M 12.164062 83.3125 "
                fillOpacity="1"
                fillRule="nonzero"
              />
            </g>
          </svg>
          <p>EcoWise</p>
        </div>
      </section>
    </div>
  );
}

export default Receipt;
