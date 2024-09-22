import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";


function App() {
  const [pointsOfInterest, setPointsOfInterest] = useState([])

  useEffect(()=> {
    fetch("/api/landmarks")
    .then(resp => resp.json())
    .then(data => console.log(data))
  })


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