import React, { useState, useEffect, useContext } from "react";
import { MapContext } from "../context/MapContext"
import MapContainer from "./MapContainer";
import ScavengerProgress from "./ScavengerProgress"
import ScavengerMarkers from "./ScavengerMarkers";
import { Circle, DirectionsRenderer, Marker, OverlayView } from "@react-google-maps/api";
import ScavengerList from "./ScavengerList";
import "../styles/scavenger.css"

const center = {lat: 38.048172393597355, lng: -84.4964571176625}; // center of the entire scavenger area
const center2 = { lat: 38.05224348731636, lng: -84.49533042381834}; // position of starting point

const useGeolocation = (setUserLocation, accuracyThreshold = 50, startHunt, mapRef, setHeading) => {
  useEffect(() => {
    if (startHunt && "geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.accuracy <= accuracyThreshold) {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };

            setUserLocation(newLocation);

            // Auto-pan to new location
            if (mapRef.current) {
              mapRef.current.panTo(newLocation);
            }
          } else {
            console.warn(
              "Location accuracy too low:",
              position.coords.accuracy
            );
          }
        },
        (error) => console.error("Error fetching geolocation", error),
        { enableHighAccuracy: true }
      );

      // Capture heading data from the device's compass (if supported)
      const handleOrientation = (event) => {
        if (event.alpha !== null) {
          const heading = 360 - event.alpha; // Get the compass heading (0-360)
          console.log(event.alpha)
          setHeading(heading); // Update heading state
        }
      };

      window.addEventListener("deviceorientation", handleOrientation);

      // Cleanup on component unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, [setUserLocation, accuracyThreshold , startHunt, mapRef, setHeading]);
};

const ScavengerHunt = () => {
  const { mapRef } = useContext(MapContext);
  const [startHunt, setStartHunt] = useState(false)
  const [userLocation, setUserLocation] = useState(null); // Current user location
  const [huntLocations, setHuntLocations] = useState(null); // Scavenger hunt locations
  const [userProgress, setUserProgress] = useState(0) // keeping track of how many location user has visited, will increase by 1 after a location is found (max: 10 - completed hunt)
  const [userPoints, setUserPoints] = useState(0); // keeping track of user points
  const [heading, setHeading] = useState(0) // Users compass heading

  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [routeSegments, setRouteSegments] = useState([])


  const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

//fetching scavenger hunt locations from backend
  useEffect(() => {
    fetch(`${apiUrl}/api/hunt-locations`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        setHuntLocations(data);
        calculateRoute(data)
      })
      .catch((err) => console.error("Failed to fetch hunt locations", err));
  }, []);

  // Use geolocation when the hunt starts
  useGeolocation(setUserLocation, 50, startHunt, mapRef, setHeading);

  const handleClickHere = () =>{
    setStartHunt(true)
    mapRef.current.panTo(center)
    mapRef.current.setZoom(16.3)
  };

  //route calculatons
  const calculateRoute = async (locations) => {
    const sortedCoordinates = locations
      .sort((a, b) => a.routeIndex - b.routeIndex)  // Sort by routeIndex
      .map(location => location.location);          // Extract location after sorting

    const wayPointsObj = sortedCoordinates.slice(1,-1).map((coord) => ({location: coord}));

    const directionsServiceOptions = {
      origin: sortedCoordinates[0],
      destination: sortedCoordinates[sortedCoordinates.length -1],
      travelMode: "WALKING",
      waypoints: wayPointsObj
    };

    try {
      const directionsService = new google.maps.DirectionsService();
      const results = await new Promise((resolve, reject) => {
        directionsService.route(directionsServiceOptions, (response, status) => {
          if (status === "OK"){
            resolve(response);
          } else {
            reject(`Directions request failed due to ${status}`);
          }
        });
      });
      setDirectionsResponse(results);
      splitRouteIntoSegments(results);
    } catch (error) {
      console.error(error);
    }

    function splitRouteIntoSegments(directionsResult) {
      const legs = directionsResult.routes[0].legs;
      const segments = [];

      // Each leg represents a portion of the journey (origin -> waypoint, waypoint -> destination)
      for (let i = 0; i < legs.length; i++) {
        segments.push({
          origin: legs[i].start_location,
          destination: legs[i].end_location,
          steps: legs[i].steps
        });
      }
      setRouteSegments(segments);
    };
  }
  
  const checkLocation = () => {
    if (!userLocation || !huntLocations || userProgress >= huntLocations.length) return;
    
    const nextLocation = huntLocations[userProgress];
    const userLatLng = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
    const huntLatLng = new window.google.maps.LatLng(nextLocation.lat, nextLocation.lng);

    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(userLatLng, huntLatLng);

    // If the user is within 50 meters of the next location, award points and update progress
    if (distance <= 50) {
      setUserProgress(userProgress + 1);
      setUserPoints(userPoints + 20);
      console.log(`Location verified: ${nextLocation.name}. Points: ${userPoints + 20}`);
    }
  };

  // Check location on every geolocation update
  useEffect(() => {
    if (startHunt && userLocation) {
      checkLocation();  
    }
  }, [userLocation]);


  return (
    <>
      {!startHunt ? (
        <div className="information">
          <h2>Scavenger Hunt</h2>
          <p>
            Ready to test your knowledge of Lexington, KY? Earn points playing
            our scavenger hunt.
          </p>
          <p>
            If you are ready, head to downtown Lexington to the marker on the
            map. Once you are there, click on the button to start. Note will
            turn on GPS monitoring.
          </p>
          <button onClick={handleClickHere}>I am here!</button>
          {/* Once clicked, can turn on GPS*/}
        </div>
      ) : (
        <div className="hunt-interface">
          <ScavengerProgress
            huntLocations={huntLocations}
            userProgress={userProgress}
          />
          <p>Points: {userPoints}</p>

          {/*BUTTON can be deleted or use if gps is not working well?*/}
          <button
            onClick={() => {
              if (userProgress < 10) {
                setUserProgress((prev) => prev + 1);
                setUserPoints((prev) => prev + 20);
              }
            }}
          >
            TEST button for user progression
          </button>
        </div>
      )}
      {huntLocations && (
        <div className="display-section">
          <MapContainer
            center={userLocation ? userLocation : center2}
            zoom={15}
          >
            {!startHunt ? (
              <Marker position={center2} />
            ) : (
              <>
                <Circle
                  center={center}
                  radius={530}
                  options={{
                    strokeWeight: 0.5,
                    fillOpacity: 0.08,
                  }}
                />
                {userLocation && (
                  <>
                    {/* Display user's location with a blue dot */}
                    <Marker
                      position={userLocation}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE, // A directional triangle
                        fillColor: "#0096FF",
                        fillOpacity: 1,
                        scale: 7,
                        rotation: heading, // Rotate the triangle based on user heading
                        strokeWeight: 1.4,
                        strokeColor: "#007AFF",
                      }}
                    />

                    {/* Use OverlayView to render custom elements at the user's location */}
                    <OverlayView
                      position={userLocation}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <div
                        style={{ position: "relative", width: 0, height: 0 }}
                      >
                        <div className="pulse-circle" />
                        <div
                          className="directional-cone"
                          style={{ transform: `rotate(${heading - 26}deg)` }}
                        />
                      </div>
                    </OverlayView>
                  </>
                )}
                <ScavengerMarkers
                  huntLocations={huntLocations}
                  userProgress={userProgress}
                />

                {routeSegments.length > 0 && userProgress > 1 && (
                  <DirectionsRenderer
                    directions={{
                      ...directionsResponse,
                      routes: [
                        {
                          legs: routeSegments.slice(0, userProgress - 1), // Render up to current progress
                        },
                      ],
                    }}
                    options={{
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeColor: "#69c261", // Customize the route color (red)
                        strokeOpacity: 0.7, // Customize the opacity of the route
                        strokeWeight: 5, // Customize the width of the route
                      },
                      suppressInfoWindows: true, // Disable default info windows
                    }}
                  />
                )}
              </>
            )}
          </MapContainer>
          <ScavengerList
            huntLocations={huntLocations}
            userProgress={userProgress}
          />
        </div>
      )}
    </>
  );
};

export default ScavengerHunt;
