import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../Firebase/cofig";
import { collection, getDocs } from "firebase/firestore";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import Navbar from "./Navbar";
import Loader from "./Loader";
import Legend from "./Legend";
import Footer from "./Footer";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// This component helps handle the routing control
function RoutingMachine({ userLocation, selectedLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (!userLocation || !selectedLocation) return;
    
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lon),
        L.latLng(selectedLocation.lat, selectedLocation.lon)
      ],
      router: new L.Routing.OSRMv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4 }]
      },
      createMarker: function() { return null; }
    }).addTo(map);
    
    return () => map.removeControl(routingControl);
  }, [map, userLocation, selectedLocation]);
  
  return null;
}

export default function Maps() {
  // Replace with your GoMaps Pro API key
  const goMapsProApiKey = "AlzaSyP_teH51lCtLRL9S_dTDJkpXuqXfPp7nuD";
  
  const [forestLocations, setForestLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapHeight, setMapHeight] = useState("70vh");

  // Define custom icons
  const customMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  const dustbinMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  const recyclerMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  const ragPickerMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  const ewasteMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setUserLocation(JSON.parse(storedLocation));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUserLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          localStorage.setItem(
            "userLocation",
            JSON.stringify(newUserLocation)
          );
          setUserLocation(newUserLocation);
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Default to a location if geolocation fails
          const defaultLocation = { lat: 28.6139, lon: 77.2090 }; // Delhi, India
          setUserLocation(defaultLocation);
        }
      );
    }

    function handleResize() {
      setMapHeight(window.innerWidth <= 768 ? "50vh" : "70vh");
    }

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);

    // Add some sample data if Firebase fails or for testing
    const sampleLocations = [
      {
        id: "1",
        name: "City Park Dustbin",
        lat: 28.6139,
        lon: 77.2290,
        type: "Dustbins"
      },
      {
        id: "2",
        name: "Metro Station Recycler",
        lat: 28.6339,
        lon: 77.2190,
        type: "Recyclers"
      },
      {
        id: "3",
        name: "Local Rag Picker",
        lat: 28.6039,
        lon: 77.2090,
        type: "RagPickers"
      },
      {
        id: "4",
        name: "E-Waste Collection Center",
        lat: 28.6239,
        lon: 77.1990,
        type: "ewaste"
      }
    ];

    const fetchForestLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "location"));
        const locationsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          lat: doc.data().latitude,
          lon: doc.data().longitude,
          type: doc.data().type,
        }));
        
        if (locationsArray.length > 0) {
          setForestLocations(locationsArray);
        } else {
          // Use sample data if Firebase returns empty
          setForestLocations(sampleLocations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        // Use sample data if Firebase fails
        setForestLocations(sampleLocations);
      } finally {
        setLoading(false);
      }
    };

    fetchForestLocations();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleShare = (locationName) => {
    if (navigator.share) {
      navigator.share({
        title: 'Bin Locator',
        text: `Check out this location: ${locationName}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported');
      alert('Sharing not supported on this browser');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="py-5" style={{ background: "#E2F5D2" }}>
        <div className="mx-auto text-center md:w-8/12 py-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Bin Locator</h2>

          <p className="mt-4 px-4">
            A digital tool facilitating efficient waste management by
            pinpointing the locations of various bins for different types of
            waste, including dustbins, recycling bins, e-waste bins, and areas
            frequented by rag pickers.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:px-10 mx-auto">
          <div className="w-full md:w-11/12 h-full md:flex-grow">
            <div className="w-11/12 mx-auto rounded-lg my-4 text-center border-2 border-black">
              {userLocation && (
                <MapContainer
                  center={[userLocation.lat, userLocation.lon]}
                  zoom={13}
                  style={{ height: mapHeight, width: "100%" }}
                >
                  {/* Use OpenStreetMap as a fallback if GoMaps Pro key is not available */}
                  {goMapsProApiKey && goMapsProApiKey !== "AlzaSyP_teH51lCtLRL9S_dTDJkpXuqXfPp7nuD" ? (
                    <TileLayer
                      attribution="GoMaps Pro"
                      url={`https://www.gomaps.pro/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}&key=${goMapsProApiKey}`}
                    />
                  ) : (
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  )}
                  
                  {/* User location marker */}
                  <Marker
                    position={[userLocation.lat, userLocation.lon]}
                    icon={customMarkerIcon}
                  >
                    <Popup>Your Location</Popup>
                  </Marker>
                  
                  {/* Bin location markers */}
                  {forestLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.lat, location.lon]}
                      icon={
                        location.type === "Dustbins"
                          ? dustbinMarkerIcon
                          : location.type === "Recyclers"
                          ? recyclerMarkerIcon
                          : location.type === "ewaste"
                          ? ewasteMarkerIcon
                          : ragPickerMarkerIcon
                      }
                      eventHandlers={{
                        click: () => handleLocationClick(location),
                      }}
                    >
                      <Popup>
                        <div className="font-bold">{location.name}</div>
                        <div>Type: {location.type}</div>
                        <div className="mt-2">
                          <button 
                            className="bg-green-800 p-2 m-1 text-white rounded"
                            onClick={() => handleLocationClick(location)}
                          >
                            Directions
                          </button>
                          <button
                            className="bg-green-800 p-2 m-1 text-white rounded"
                            onClick={() => handleShare(location.name)}
                          >
                            Share
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Routing machine component */}
                  {selectedLocation && (
                    <RoutingMachine 
                      userLocation={userLocation} 
                      selectedLocation={selectedLocation} 
                    />
                  )}
                </MapContainer>
              )}
            </div>
          </div>
          <div className="md:flex w-full md:w-3/12 mx-auto my-4 text-center">
            <div className="w-11/12 md:w-11/12 mx-auto border-2 border-black rounded-lg h-full md:justify-end bg-white">
              <Legend />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}