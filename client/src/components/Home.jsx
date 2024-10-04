import MapContainer from "./MapContainer";
import { useState, useEffect } from "react";
import { Marker, DirectionsRenderer } from "@react-google-maps/api";
import { fetchGTFSData, drawBusRoute } from "./transitfunction";

import MapButtons from "./MapButtons";
import SearchBar from "./SearchBar";
import RoutePlanner from "./RoutePlanner";

const Home = () => {
  const [polylines, setPolylines] = useState([]);
  const [visibleTransit, setVisibleTransit] = useState(true);
  const [showRoute, setShowRoute] = useState(false);

  // This is for creating our stops because the transit layer doesn't display them
  const [stops, setStops] = useState([]);
  // This is for creating the shapes, connecting the stops together into routes
  const [shapes, setShapes] = useState([]);
  // For the positioning of the map
  const [markerPosition, setMarkerPosition] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);


  useEffect(() => {
    const map = getMapInstance(); // Initialize the map
    if (map) {
      map.panTo({ lat: 37.7749, lng: -122.4194 }); // Example action to move the map
    }
  }, []);

  //Fetch transit system data
  useEffect(() => {
    fetchGTFSData({ setStops, setShapes });
  }, []);

  useEffect(() => {
    if (!mapInstance) {
      console.log("Map instance is NOT ready yet...");
      return;
    }

    const delayMapInstance = setTimeout(() => {
      if (shapes.length > 0) {
        console.log("drawing bus route with map instance: ");
        drawBusRoute(mapInstance, shapes, setPolylines);
      }
    }, 1000);

    return () => clearTimeout(delayMapInstance);
  }, [mapInstance, shapes]);

  // Toggle the visibility of all polylines
  const togglePolylines = () => {
    polylines.forEach((polyline) => {
      if (polyline.getMap()) {
        polyline.setMap(null); // Hide the polyline
        setVisibleTransit(false);
      } else {
        polyline.setMap(mapInstance); // Show the polyline
        setVisibleTransit(true);
      }
    });
  };

  const clearSearch = () => {
    setMarkerPosition(null);
    mapInstance.panTo(center);
    mapInstance.setZoom(13);
  };

  return (
    <>
      <div className="interaction-menu">
        {/* Toggle between route planner and search bar */}
        {showRoute ? (
          <RoutePlanner
            mapInstance={mapInstance}
            setDirectionsResponse={setDirectionsResponse}
          />
        ) : (
          <SearchBar
            mapInstance={mapInstance}
            setMarkerPosition={setMarkerPosition}
            clearSearch={clearSearch}
          />
        )}
        <MapButtons
          clearSearch={clearSearch}
          setShowRoute={setShowRoute}
          showRoute={showRoute}
          togglePolyLines={togglePolylines}
          visibleTransit={visibleTransit}
        />
      </div>

      <MapContainer>
        {/* Add a marker if a place is selected */}
        {markerPosition && <Marker position={markerPosition} />}
        <PoiMarkers/>

        {/* Render Directions on the map */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </MapContainer>
    </>
  );
};

export default Home;
