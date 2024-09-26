import { useState, useEffect } from "react";
import JSZip from 'jszip'
import Papa from 'papaparse'
import axios from "axios";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import PoiMarkers from "./PoiMarkers";

const Home = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  
  // This relates to the transit layer state
  const [mapInstance, setMapInstance] = useState(null);

  // This is for creating our stops because the transit layer doesn't display them
  const [stops, setStops] = useState([]);
  
  // This is for creating the shapes, connecting the stops together into routes
  const [shapes, setShapes] = useState([])
  
  // This will be triggered on Mapload
  const onMapLoad = (map) => {
    console.log("Map Loaded: ", map)
    setMapInstance(map);
  
    // This adds the transit layer when the map is loaded
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  };

  const apiUrl = 
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL

  console.log("API URL:", apiUrl);
  
  useEffect(() => {
    fetch(`${apiUrl}/api/landmarks`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json()
      })
      .then((data) => {
        console.log(data);
        setPointsOfInterest(data);
      })
      .catch((err) => console.error("Failed to fetch landmarks", err));
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        // This is the map component that can be customized
        mapContainerStyle={{
          width: "70vh",
          height: "70vh",
          marginLeft: "26rem",
        }}
        center={{ lat: 38.0406, lng: -84.5037 }}
        zoom={11.9}
        mapId="90d6d90b957e9186" // This helps with styling default points of interest
        gestureHandling={"cooperative"}
        disableDefaultUI={false}
        onLoad={onMapLoad}
      >
        
        <PoiMarkers pois={pointsOfInterest}/>
      </GoogleMap>
    </LoadScript>
  );
};




export default Home;
