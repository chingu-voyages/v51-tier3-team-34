import { useState, useEffect, useContext } from "react";
import { Marker } from "@react-google-maps/api";
import marker2 from "../assets/marker2.png";
import { MapContext } from "../context/MapContext";

import React from "react";

const ScavengerMarkers = ({ huntLocations, userProgress }) => {
  const { mapRef } = useContext(MapContext);
  const mapInstance = mapRef.current;

  const filterLocations = huntLocations.filter(
    (location) => location.routeIndex <= userProgress,
  );
  const sortedLocations = filterLocations.sort(
    (a, b) => a.routeIndex - b.routeIndex,
  );

  // useEffect(()=>{
  //   if (!mapInstance){
  //     return;
  //   }
  // }, [mapInstance])

  return (
    <>
      {filterLocations.map((poi) => (
        <Marker
          key={poi._id}
          position={poi.location}
          icon={{
            url: marker2,
            scaledSize: { width: 30, height: 30 },
            anchor: new window.google.maps.Point(15, 30),
          }}
        />
      ))}
    </>
  );
};

export default ScavengerMarkers;
