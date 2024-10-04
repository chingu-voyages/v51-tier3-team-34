import React, { useState, useEffect } from "react";
import MapContainer from "./MapContainer";

const useGeolocation = (setUserLocation, accuracyThreshold = 50) => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.accuracy <= accuracyThreshold) {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy, 
            });
          } else {
            console.warn("Location accuracy too low:", position.coords.accuracy);
          }
        },
        (error) => console.error("Error fetching geolocation", error),
        { enableHighAccuracy: true }
      );
    }
  }, [setUserLocation, accuracyThreshold]);
};

const ScavengerHunt = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [huntLocations, setHuntLocations] = useState(null); // Scavenger hunt locations
  const accuracyThreshold = 50; // Threshold for location accuracy in meters

  const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

//fetching scavenger hunt locations from backend
  useEffect(() => {
    fetch(`${apiUrl}/api/hunt-locations`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        setHuntLocations(data);
      })
      .catch((err) => console.error("Failed to fetch hunt locations", err));
  }, []);

  useGeolocation(setUserLocation);

  return (
    <>
      <MapContainer userLocation={userLocation} huntLocations={huntLocations} />
    </>
  );
};

export default ScavengerHunt;
