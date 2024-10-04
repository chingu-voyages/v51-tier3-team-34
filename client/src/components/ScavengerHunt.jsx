import React, { useState, useEffect, useContext } from "react";
import MapContainer from "./MapContainer";
import ScavengerProcess from "./ScavengerProcess"
import { Circle, Marker } from "@react-google-maps/api";
import CustomMarker from "./CustomMarker";
import ScavengerMarkers from "./ScavengerMarkers";
import { MapContext } from "../context/MapContext";

const accuracyThreshold = 50; // Threshold for location accuracy in meters

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
      <div className="information">
        <h2>Scavenger Hunt</h2>
        <p>Ready to test your knowledge of Lexington, KY? Earn points playing our scavenger hunt.</p>
        <p>If you are ready, head to downtown Lexington to the marker on the map. Once you are there, click on the button to start.</p>
      </div>
      <button>I am here!</button> {/* Once clicked, can turn on GPS*/ }
      <ScavengerProcess huntLocations={huntLocations}/>
      {huntLocations &&
        <MapContainer center={{lat: 38.04963007625419, lng: -84.49553566106573}} zoom={16}> 
          <ScavengerMarkers huntLocations={huntLocations}/>
          <CustomMarker/>
        </MapContainer>
      }
    </>
  );
};

export default ScavengerHunt;
