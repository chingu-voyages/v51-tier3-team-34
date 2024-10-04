import React, { useContext } from 'react';
import { Marker } from '@react-google-maps/api';


const CustomMarker = () => {
  
    const position = { lat: 38.052327640, lng: -84.497 }; // Valid coordinates

    console.log('Rendering CustomMarker:', position); // Check if position is logged
  

  return (
    <Marker position={position} />
  );
};

export default CustomMarker;