import React, { useState, useEffect, useContext } from "react";
import { MapContext } from "../context/MapContext";
import { UserContext } from "../context/UserContext";
import MapContainer from "./MapContainer";
import ScavengerProgress from "./ScavengerProgress";
import ScavengerMarkers from "./ScavengerMarkers";
import {
  Circle,
  DirectionsRenderer,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import ScavengerList from "./ScavengerList";
import "../styles/scavenger.css";

const center = { lat: 38.048172393597355, lng: -84.4964571176625 }; // Center of the scavenger area
const center2 = { lat: 38.05224348731636, lng: -84.49533042381834 }; // Starting point

const ScavengerHunt = () => {
  const { mapRef } = useContext(MapContext);
  const [startHunt, setStartHunt] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [huntLocations, setHuntLocations] = useState(null);
  const [userProgress, setUserProgress] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [heading, setHeading] = useState(0);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routeSegments, setRouteSegments] = useState([]);

  const apiUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:8080"
      : import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    fetch(`${apiUrl}/api/hunt-locations`)
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP error! Status: ${resp.status}`);
        return resp.json();
      })
      .then((data) => {
        setHuntLocations(data);
        calculateRoute(data);
      })
      .catch((err) => console.error("Failed to fetch hunt locations", err));
  }, []);

  const startLocationTracking = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (position.coords.accuracy <= 50) {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(newLocation);

          if (mapRef.current) mapRef.current.panTo(newLocation);
        }
      },
      (error) => console.error("Error fetching geolocation", error),
      { enableHighAccuracy: true },
    );

    // Capture heading data
    const handleOrientation = (event) => {
      let newHeading = (360 - event.alpha) % 360;
      if (newHeading < 0) newHeading += 360;
      setHeading(newHeading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      console.warn("Device orientation not supported.");
    }

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  };

  const handleClickHere = () => {
    setStartHunt(true);
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(16.3);
    }
    startLocationTracking();
  };

  const calculateRoute = async (locations) => {
    const sortedCoordinates = locations
      .sort((a, b) => a.routeIndex - b.routeIndex)
      .map((location) => location.location);

    const wayPointsObj = sortedCoordinates
      .slice(1, -1)
      .map((coord) => ({ location: coord }));

    const directionsServiceOptions = {
      origin: sortedCoordinates[0],
      destination: sortedCoordinates[sortedCoordinates.length - 1],
      travelMode: "WALKING",
      waypoints: wayPointsObj,
    };

    try {
      const directionsService = new google.maps.DirectionsService();
      const results = await new Promise((resolve, reject) => {
        directionsService.route(
          directionsServiceOptions,
          (response, status) => {
            if (status === "OK") resolve(response);
            else reject(`Directions request failed due to ${status}`);
          },
        );
      });
      setDirectionsResponse(results);
      splitRouteIntoSegments(results);
    } catch (error) {
      console.error(error);
    }
  };

  const splitRouteIntoSegments = (directionsResult) => {
    const legs = directionsResult.routes[0].legs;
    const segments = legs.map((leg) => ({
      origin: leg.start_location,
      destination: leg.end_location,
      steps: leg.steps,
    }));
    setRouteSegments(segments);
  };

  const checkLocation = () => {
    if (!userLocation || !huntLocations || userProgress >= huntLocations.length)
      return;

    const nextLocation = huntLocations[userProgress];
    const userLatLng = new window.google.maps.LatLng(
      userLocation.lat,
      userLocation.lng,
    );
    const huntLatLng = new window.google.maps.LatLng(
      nextLocation.lat,
      nextLocation.lng,
    );

    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        userLatLng,
        huntLatLng,
      );

    if (distance <= 50) {
      setUserProgress(userProgress + 1);
      setUserPoints(userPoints + 20);
    }
  };

  useEffect(() => {
    if (startHunt && userLocation) checkLocation();
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
          <button onClick={handleClickHere}>I am here!</button>
        </div>
      ) : (
        <div className="hunt-interface">
          <ScavengerProgress
            huntLocations={huntLocations}
            userProgress={userProgress}
            userPoints={userPoints}
          />
          <p>Points: {userPoints}</p>

          {/*BUTTON can be deleted or use if gps is not working well?*/}
          {/* <button
            onClick={() => {
              if (userProgress < 10) {
                setUserProgress((prev) => prev + 1);
                setUserPoints((prev) => prev + 20);
              }
            }}
          >
            TEST button for user progression
          </button> */}
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
                  options={{ strokeWeight: 0.5, fillOpacity: 0.08 }}
                />
                {userLocation && (
                  <>
                    <Marker
                      position={userLocation}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: "#0096FF",
                        fillOpacity: 1,
                        scale: 7,
                        strokeWeight: 1.4,
                        strokeColor: "#007AFF",
                      }}
                    />
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
                        { legs: routeSegments.slice(0, userProgress - 1) },
                      ],
                    }}
                    options={{
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeColor: "#69c261",
                        strokeOpacity: 0.7,
                        strokeWeight: 5,
                      },
                      suppressInfoWindows: true,
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
