import React, { useContext, useEffect } from 'react';
import { Marker } from '@react-google-maps/api';
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

  
  const position = { lat: 38.052327640, lng: -84.497 }; // Valid coordinates


  console.log('Rendering CustomMarker:', position); // Check if position is logged
  

  return (
    <Marker position={position} />
  );
};

export default CustomMarker;