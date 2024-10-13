import MapContainer from "./MapContainer";
import { useState, useEffect, useContext } from "react";
import { Marker, DirectionsRenderer } from "@react-google-maps/api";
import { fetchGTFSData, drawBusRoute } from "./transitfunction";
import { MapContext } from "../context/MapContext";
import PoiMarkers from "./PoiMarkers";
import MapButtons from "./MapButtons";
import SearchBar from "./SearchBar";
import RoutePlanner from "./RoutePlanner";
import { UserContext } from "../context/UserContext";

const center = { lat: 38.0406, lng: -84.5037 };

const Home = () => {
  const { currentUser } = useContext(UserContext);
  const { mapRef } = useContext(MapContext);
  const mapInstance = mapRef.current;

  // const [mapInstance, setMapInstance] = useState(null)
  const [polylines, setPolylines] = useState([]);
  const [visibleTransit, setVisibleTransit] = useState(true);
  const [showRoute, setShowRoute] = useState(false);

  // This is for creating our stops because the transit layer doesn't display them
  const [stops, setStops] = useState([]);
  // This is for creating the shapes, connecting the stops together into routes
  const [shapes, setShapes] = useState([]);

  const [markerPosition, setMarkerPosition] = useState(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);

  //Fetch transit system data
  useEffect(() => {
    fetchGTFSData({ setStops, setShapes });
  }, []);

  useEffect(() => {
    if (!mapInstance) {
      // console.log("Map instance is NOT ready yet...");
      return;
    }

    const delayMapInstance = setTimeout(() => {
      if (shapes.length > 0) {
        // console.log("drawing bus route with map instance: ");
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
      {currentUser && (
        <h3 style={{ textAlign: "center" }}>Welcome {currentUser.name}</h3>
      )}
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

      <MapContainer center={center} zoom={13}>
        {/* Add a marker if a place is selected */}
        {markerPosition && <Marker position={markerPosition} />}
        <PoiMarkers />
        {/* Render Directions on the map */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </MapContainer>
    </>
  );
};

export default Home;
