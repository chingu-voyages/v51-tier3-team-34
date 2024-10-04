import { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { fetchGTFSData } from "./transitfunction";
import MapButtons from "./MapButtons";
import SearchBar from "./SearchBar";
import RoutePlanner from "./RoutePlanner";

const center = { lat: 38.0406, lng: -84.5037 };


const MapContainer = () => {
  const [mapInstance, setMapInstance] = useState(null);

  const mapStyles = [
    // Turn off points of interest that is default in googlemaps.
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ];


  return (
    <>
      <GoogleMap
        // This is the map component that can be customized
        mapContainerStyle={{
          width: "70vh",
          height: "70vh",
          marginLeft: "26rem",
        }}
        center={center}
        zoom={13}
        mapId="90d6d90b957e9186" // This helps with styling default points of interest
        gestureHandling={"cooperative"}
        disableDefaultUI={false}
        onLoad={(map) => setMapInstance(map)}
        options={{ styles: mapStyles }}
      >
      </GoogleMap>
      </>
  );
};

export default MapContainer;
