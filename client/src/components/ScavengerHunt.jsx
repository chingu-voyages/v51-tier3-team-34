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
  const accuracyThreshold = 50; // Threshold for location accuracy in meters

  useGeolocation(setUserLocation);

  return (
    <>
      <MapContainer />
    </>
  );
};

export default ScavengerHunt;
