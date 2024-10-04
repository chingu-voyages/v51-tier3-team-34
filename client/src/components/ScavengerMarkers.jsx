import { useState, useEffect, useContext } from "react";
import { Marker} from "@react-google-maps/api";
import marker from "../assets/marker.png";
import { MapContext } from "../context/MapContext"

import React from 'react'

const ScavengerMarkers = ({huntLocations}) => {
  // const { mapRef } = useContext(MapContext)
  // const mapInstance = mapRef.current
  // useEffect(()=>{
  //   if (!mapInstance){
  //     return;
  //   }
  // }, [mapInstance])

  return (
    <>
      {huntLocations.map((poi)=> (
        <Marker
        key={poi._id}
        position={poi.location}
        icon={{ url: marker, scaledSize: { width: 50, height: 50 } }}
        />
      ))}
    </>
  )
}

export default ScavengerMarkers
