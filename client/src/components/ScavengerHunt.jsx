import React, { useState, useEffect } from "react";

import MapContainer from "./MapContainer";
import ScavengerProcess from "./ScavengerProcess"
import { Circle, Marker } from "@react-google-maps/api";
import CustomMarker from "./CustomMarker";
import PoiMarkers from "./PoiMarkers";



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
      <div className="information">
        <h2>Scavenger Hunt</h2>
        <p>Ready to test your knowledge of Lexington, KY? Earn points playing our scavenger hunt.</p>
        <p>If you are ready, head to downtown Lexington to the marker on the map. Once you are there, click on the button to start.</p>
      </div>
      <button>I am here!</button> {/* Once clicked, can turn on GPS*/ }
      <ScavengerProcess/>
      <MapContainer> 
        {/* <CustomMarker/>
        <PoiMarkers/> */}
      </MapContainer>
    </>
  );
};

export default ScavengerHunt;
