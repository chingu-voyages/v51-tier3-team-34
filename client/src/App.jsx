import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";


// LAT and LNG place markers where they should be. Type and imgURL are for implementing custom images or icons.  
const pointsOfInterest = [
  {
    key: "maryToddHouse",
    location: { lat: 38.05462, lng: -84.49666 },
    type: "default",
    imgURL: "",
  },
  {
    key: "ashland",
    location: { lat: 38.030517, lng: -84.484004 },
    type: "default",
    imgURL: "",
  },
  {
    key: "huntMorganHouse",
    location: { lat: 38.04965, lng: -84.49588 },
    type: "default",
    imgURL: "",
  },
  {
    key: "lexingtonCemetery",
    location: { lat: 38.06149, lng: -84.49049 },
    type: "default",
    imgURL: "",
  },
  {
    key: "waveland",
    location: { lat: 37.95511, lng: -84.54357 },
    type: "default",
    imgURL: "",
  },
  {
    key: "historicMorrisonHall",
    location: { lat: 38.039401, lng: -84.501246 },
    type: "default",
    imgURL: "",
  },
  {
    key: "oldFayetteCountyCourthouse",
    location: { lat: 38.04798, lng: -84.49688 },
    type: "default",
    imgURL: "",
  },
  {
    key: "gratzPark",
    location: { lat: 38.05145, lng: -84.4963 },
    type: "default",
    imgURL: "",
  },
  {
    key: "cheapsidePark",
    location: { lat: 38.04854, lng: -84.49685 },
    type: "default",
    imgURL: "",
  },
  {
    key: "trianglePark",
    location: { lat: 38.0492, lng: -84.4994 },
    type: "default",
    imgURL: "",
  },
];


function App() {

  //TESTING - can be delete if needed
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits)
    console.log(response.data.fruits);
  };

  useEffect(()=> {
    fetchAPI();
  }, [])

  return (
    <>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      >
        <Map
          // This is the map component that can be customized
          style={{ width: "70vh", height: "70vh", marginLeft: "26rem" }}
          defaultCenter={{ lat: 38.0406, lng: -84.5037 }}
          defaultZoom={11.9}
          mapId="90d6d90b957e9186" // This helps with styling default points of interest 
          gestureHandling={"cooperative"} 
          disableDefaultUI={true}
        />
        <PoiMarkers pois={pointsOfInterest} />
      </APIProvider>
    </>
  );
}

const PoiMarkers = ({ pois }) => {
  return (
    // I (Cody) wasn't able to get this code block to work yet.
    // The idea is that if type = default then a regular marker will be displayed.
    // I was following this part of the google documentation: https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          icon={
            poi.type === "custom" ? (
              {
                url: poi.imgURL, // Custom image
                scaledSize: { width: 50, height: 50 },
              }
            ) : (
              <Pin
                background={"gold"}
                glyphColor={"black"}
                borderColor={"black"}
              />
            )
          }
        ></AdvancedMarker>
      ))}
    </>
  );
};


export default App