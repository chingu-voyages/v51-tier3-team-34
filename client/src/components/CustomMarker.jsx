import React, { useContext, useEffect } from 'react';
import { Circle, Marker } from '@react-google-maps/api';
import { MapContext } from "../context/MapContext"


const CustomMarker = () => {
  const { mapRef } = useContext(MapContext)
  const mapInstance = mapRef.current
  
  // useEffect(()=>{
  //   if (!mapInstance){
  //     return;
  //   }
  //   mapInstance.panTo(position)
  // }, [mapInstance])

  const position = { lat: 38.05224348731636, lng: -84.49533042381834}; // Valid coordinates

  return (
    <>
    <Marker position={position} />
    <Circle center={position} radius={30}/>
    </>
  );
};

export default CustomMarker;