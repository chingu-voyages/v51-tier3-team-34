import React, { useState, useEffect } from "react";
import MapContainer from "./MapContainer";



const useGeolocation = (setUserLocation) => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error fetching geolocation", error),
        { enableHighAccuracy: true },
      );
    }
  }, [setUserLocation]);
};

const ScavengerHunt = () => {
  const [huntProgress, setHuntProgress] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  useGeolocation(setUserLocation);

  return (
    <>
      <MapContainer />
    </>
  );
};

export default ScavengerHunt;
