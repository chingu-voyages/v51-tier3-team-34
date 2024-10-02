import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { FaLocationArrow } from "react-icons/fa";

const center = { lat: 38.0406, lng: -84.5037 }

const RoutePlanner = ({ mapInstance, setDirectionsResponse }) => {
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  // Handle travel mode change
  const handleTravelModeChange = (event) => { 
    setTravelMode(event.target.value);
  };

  // Calculate the route
  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // Use Google Maps Directions API
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: travelMode,
    });

    console.log("Directions response:", results);

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  // Clear the route
  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  // Get current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentLocation = new window.google.maps.LatLng(lat, lng);

         // Pan to current location
         mapInstance.panTo(currentLocation);
         mapInstance.setZoom(15);

        originRef.current.value = `${lat}, ${lng}`;
      }, (error) => {
        console.error("Error retrieving location", error);
        alert("Unable to retrieve your location.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Toggle GPS
  const toggleGps = () => {
    setGpsEnabled((prevState) => {
      if (prevState) {
        mapInstance.panTo(center);
        mapInstance.setZoom(13);
        originRef.current.value = "";
    } else {
      handleCurrentLocation();
    }
      return !prevState;
    })
  };

  return (
    <div style={{ 
      padding: "1rem", 
      backgroundColor: "white", 
      borderRadius: "4px", 
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
      flex: "1",
      maxWidth: "1500px",
      display: "flex", 
      flexDirection: "column", 
      gap: "1rem",
      margin: "0 auto"
    }}>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "0.5rem", 
        alignItems: "center" 
    }}>
        <div style={{ width: "85%" }}>
          <Autocomplete>
            <input
              id="origin"
              type="text"
              placeholder="Starting Point"
              ref={originRef}
              style={{
                width: "100%",
                height: "32px",
                padding: "0 12px",
                borderRadius: "3px",
                border: "1px solid transparent",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                fontSize: "14px",
              }}
            />
          </Autocomplete>
        </div>
        <div style={{ width: "85%" }}>
          <Autocomplete>
            <input
              id="destination"
              type="text"
              placeholder="Destination"
              ref={destinationRef}
              style={{
                width: "100%",
                height: "32px",
                padding: "0 12px",
                borderRadius: "3px",
                border: "1px solid transparent",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                fontSize: "14px",
              }}
            />
          </Autocomplete>
        </div>

        {/* Travel mode radio buttons */}
        <div>
          <label>
            <input
              type="radio"
              name="travelMode"
              value="DRIVING"
              checked={travelMode === "DRIVING"}
              onChange={handleTravelModeChange}
            />
            Drive
          </label>
          <label>
            <input
              type="radio"
              name="travelMode"
              value="WALKING"
              checked={travelMode === "WALKING"}
              onChange={handleTravelModeChange}
            />
            Walk
          </label>
          <label>
            <input
              type="radio"
              name="travelMode"
              value="TRANSIT"
              checked={travelMode === "TRANSIT"}
              onChange={handleTravelModeChange}
            />
            Bus
          </label>
        </div>
        
        <div style={{ display: "flex", gap: "0.1rem", alignItems: "center" }}>
          <button onClick={calculateRoute}>Calculate Route</button>
          <button onClick={clearRoute}>X</button>
          <button 
            className="icon-button" 
            onClick={toggleGps}
            style={{
              color: gpsEnabled ? "green" : "gray" 
            }}
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>

      {/* Display distance and duration */}
      {distance && duration && (
        <div style={{ marginTop: "0.1rem", fontSize: "14px" }}>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;
