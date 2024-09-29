import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import PoiMarkers from "./PoiMarkers";
import { fetchGTFSData } from "./transitfunction";
import MapButtons from "./MapButtons";
import SearchBar from "./SearchBar";
import RoutePlanner from "./RoutePlanner";


const center = { lat: 38.0406, lng: -84.5037 }
const libraries = ["places"];
const cityLocation = { lat: 38.0406, lng: -84.5037 };
const searchRadius = 15000 // Radius in meters (15 km)

const Home = () => {
  const [mapInstance, setMapInstance] = useState(null)
  const [polylines, setPolylines] = useState([])
  const [visibleTransit, setVisibleTransit] = useState(true)
  const [showRoute, setShowRoute] = useState(false)
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  // This is for creating our stops because the transit layer doesn't display them
  const [stops, setStops] = useState([]);
  // This is for creating the shapes, connecting the stops together into routes
  const [shapes, setShapes] = useState([])
  // For the positioning of the map
  const [markerPosition, setMarkerPosition] = useState(null)
  const searchBoxRef = useRef(null)
  const [directionsResponse, setDirectionsResponse] = useState(null);


  const mapStyles = [
    // Turn off points of interest that is default in googlemaps.
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ];

  //Fetch transit system data
  useEffect(() => {
    fetchGTFSData({setStops, setShapes});
  }, []);

  useEffect(() => {
    if (!mapInstance) {
      console.log("Map instance is NOT ready yet...")
      return
    }

    const delayMapInstance = setTimeout(() => {
      if (shapes.length > 0) {
        console.log("drawing bus route with map instance: ")
        drawBusRoute(mapInstance, shapes)
      }
    }, 1000)

    return () => clearTimeout(delayMapInstance)

  }, [mapInstance, shapes])

  function drawBusRoute(map, shapes) {

    if (!map) {
      console.log("Map instance is null or undefined.")
      return
    }
    
    // Grouping the shapes by their ID's in order to draw the correct route
    const shapesByRoute = shapes.reduce((acc, shape) => {
      if (!acc[shape.shape_id]) {
        acc[shape.shape_id] = []
      }
      
      acc[shape.shape_id].push({ lat: shape.lat, lng: shape.lng })
      return acc
    }, {})
  
    const polylinesArray = [];

    // Draws each route
    Object.keys(shapesByRoute).forEach((routeId) => {
      const routePath = shapesByRoute[routeId];
  
      const routePolyLine = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: "red",
        strokeOpacity: .1,
        strokeWeight: 2,
      });
  
      // Adds the polylines to the map
      routePolyLine.setMap(map);
      polylinesArray.push(routePolyLine)
    
      // Adds an info window to the displayed route when clicked
      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>${routeId}</strong>`
      })
  
      routePolyLine.addListener("click", function () {
        infoWindow.setPosition(routePath[0]) // Opens the window at the start of the route
        infoWindow.open(map)
      })
    })
    setPolylines(polylinesArray)
  }

  // Toggle the visibility of all polylines
  const togglePolylines = () => {
    polylines.forEach((polyline) => {
      if (polyline.getMap()) {
        polyline.setMap(null); // Hide the polyline
        setVisibleTransit(false)
      } else {
        polyline.setMap(mapInstance); // Show the polyline
        setVisibleTransit(true)
      }
    });
  };
  
  // Search location functionality
  useEffect(() => {
    if (mapInstance && searchBoxRef.current) {
      // Initialize the SearchBox after the map is loaded
      const input = document.getElementById("search-box");
      const searchBox = new window.google.maps.places.SearchBox(input);

      // Listen for the 'places_changed' event
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const validPlaces = places.filter(place => {
          if (!place.geometry || !place.geometry.location) return false;

          // Calculate the distance from the city center
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(cityLocation.lat, cityLocation.lng),
            place.geometry.location
          );

          // Return true if the place is within the defined radius
          return distance <= searchRadius;
        });

        if (validPlaces.length === 0) {
          alert("No places found within the specificied city limit.")
        }
        const place = validPlaces[0]; // Use the first valid place for the marker
        const location = place.geometry.location;

        // Set the new position and update the map center
        setMarkerPosition({
          lat: location.lat(),
          lng: location.lng(),
        });

        mapInstance.panTo(location);
        mapInstance.setZoom(14);
      });
    }
  }, [mapInstance]);

  const clearSearch = () => {
    setMarkerPosition(null)
    mapInstance.panTo(center);
    mapInstance.setZoom(13);
  }


  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="interaction-menu">
        {/* Toggle between route planner and search bar */}
        {showRoute ? 
          <RoutePlanner mapInstance={mapInstance} setDirectionsResponse={setDirectionsResponse} />
          : <SearchBar searchBoxRef={searchBoxRef} clearSearch={clearSearch}/>
        }
        <MapButtons 
          setShowRoute={setShowRoute} 
          showRoute={showRoute}
          togglePolyLines={togglePolylines} 
          visibleTransit={visibleTransit}
        />
      </div>

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
        {/* Add a marker if a place is selected */}
        {markerPosition && <Marker position={markerPosition} />}
        <PoiMarkers setPointsOfInterest={setPointsOfInterest} pois={pointsOfInterest}/>

        {/* Render Directions on the map */}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </LoadScript>
  );
};




export default Home;
