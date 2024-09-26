import { useState, useEffect } from 'react'
import JSZip from 'jszip'
import Papa from 'papaparse'
import axios from "axios";
import {
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { GoogleMap, LoadScript } from "@react-google-maps/api";




function App() {
  // This relates to the transit layer state
  const [mapInstance, setMapInstance] = useState(null);


  // This will be triggered on load
  const onMapLoad = (map) => {
    console.log("Map Loaded: ", map)
    setMapInstance(map);

    // This adds the transit layer when the map is loaded
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  };




  useEffect(() => {
    // fetchAPI();
    fetchGTFSData();
  }, []);

  useEffect(() => {
    if (!mapInstance) {
      console.log("Map instance is NOT ready yet...")
      return
    }

    const delayMapInstance = setTimeout(() => {
      if (shapes.length > 0) {
        console.log("drawing bus route with map instance: ", mapInstance)
        drawBusRoute(mapInstance, shapes)
      }
    }, 1000)

    return () => clearTimeout(delayMapInstance)

  }, [mapInstance, shapes])

  return (
    <>
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
            <PoiMarkers pois={pointsOfInterest} />
            <BusStops stops={stops} />
          </GoogleMap>
      </LoadScript>
    </>
  );
}






export default App