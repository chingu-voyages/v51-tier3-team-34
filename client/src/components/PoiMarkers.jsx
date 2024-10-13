import { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import marker from "../assets/marker.png";

const PoiMarkers = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  const apiUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:8080"
      : import.meta.env.VITE_BACKEND_URL;

  //fetching landmarks data from backend
  useEffect(() => {
    fetch(`${apiUrl}/api/landmarks`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        setPointsOfInterest(data);
      })
      .catch((err) => console.error("Failed to fetch landmarks", err));
  }, []);

  return (
    <>
      {pointsOfInterest.map((poi) => (
        <Marker
          key={poi._id}
          position={poi.location}
          onClick={() => setSelectedPoi(poi)} // Set the selected marker on click
          icon={{ url: marker, scaledSize: { width: 50, height: 50 } }}
        />
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

export default PoiMarkers;
