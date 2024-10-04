import React, { useState, useEffect } from "react";
import MapContainer from "./MapContainer";
import ScavengerProgress from "./ScavengerProgress"
import CustomMarker from "./CustomMarker";
import ScavengerMarkers from "./ScavengerMarkers";

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
  const [startHunt, setStartHunt] = useState(false)
  const [userLocation, setUserLocation] = useState(null);
  const [huntLocations, setHuntLocations] = useState(null); // Scavenger hunt locations
  const [userProgress, setUserProgress] = useState(0) // keeping track of which location user has went to

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

  const handleClick = () =>{
    setStartHunt(true)
  }

  useGeolocation(setUserLocation);

  return (
    <>
      {!startHunt ? 
        <div className="information">
          <h2>Scavenger Hunt</h2>
          <p>Ready to test your knowledge of Lexington, KY? Earn points playing our scavenger hunt.</p>
          <p>If you are ready, head to downtown Lexington to the marker on the map. Once you are there, click on the button to start. Note will turn on GPS monitoring.</p>
          <button onClick={handleClick}>I am here!</button> {/* Once clicked, can turn on GPS*/ }
        </div> 
        :
        <ScavengerProgress huntLocations={huntLocations} userProgress={userProgress}/>
      }
      {huntLocations &&
        <MapContainer center={{lat: 38.04963007625419, lng: -84.49553566106573}} zoom={16}> 
          {!startHunt && <CustomMarker/>}
          <ScavengerMarkers huntLocations={huntLocations}/>
        </MapContainer>
      }
    </>
  );
};

export default ScavengerHunt;
