import React, { useState, useRef } from "react";
import { Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

const RoutePlanner = ({ mapInstance, setDirectionsResponse }) => {
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const originRef = useRef(null);
  const destinationRef = useRef(null);

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
      travelMode: window.google.maps.TravelMode.DRIVING, // Set toggle mode later
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

  return (
    <div style={{ 
      padding: "1rem", 
      backgroundColor: "white", 
      borderRadius: "4px", 
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
      flex: "1",
      maxWidth: "1200px",
      display: "flex", 
      flexDirection: "column", 
      gap: "1rem"
    }}>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "0.5rem", 
        alignItems: "center" 
    }}>
        <div style={{ width: "80%" }}>
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
        <div style={{ width: "80%" }}>
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
        <div>
          <button onClick={calculateRoute}>Calculate Route</button>
          <button onClick={clearRoute}>X</button>
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
