import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import marker from "../assets/marker.png";

const Home = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  useEffect(() => {
    fetch("/api/landmarks")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setPointsOfInterest(data);
      })
      .catch((err) => console.error("Failed to fetch landmarks", err));
  }, []);

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          // This is the map component that can be customized
          style={{ width: "70vh", height: "70vh", marginLeft: "26rem" }}
          defaultCenter={{ lat: 38.0406, lng: -84.5037 }}
          defaultZoom={11.9}
          mapId="90d6d90b957e9186" // This helps with styling default points of interest
          gestureHandling={"cooperative"}
          disableDefaultUI={true}
        >
          <PoiMarkers
            pois={pointsOfInterest}
            selectedPoi={selectedPoi}
            setSelectedPoi={setSelectedPoi}
          />
        </Map>
      </APIProvider>
    </>
  );
};

const PoiMarkers = ({ pois, selectedPoi, setSelectedPoi }) => {
  return (
    // I (Cody) wasn't able to get this code block to work yet.
    // The idea is that if type = default then a regular marker will be displayed.
    // I was following this part of the google documentation: https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          icon={
            poi.icontype === "custom" ? (
              {
                url: marker, // Custom image
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
          onClick={() => setSelectedPoi(poi)} // Set the selected marker on click
        ></AdvancedMarker>
      ))}

      {selectedPoi && (
        <InfoWindow
          position={selectedPoi.location}
          onCloseClick={() => setSelectedPoi(null)} // Close InfoWindow on Click
        >
          <div>
            {/* Display the actual names and descriptions of the landmarks */}
            <h3>{selectedPoi.name || "Landmark Name"}</h3>
            <p>{selectedPoi.description || "Landmark Description"}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default Home;
