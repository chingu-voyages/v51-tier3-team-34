import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  ControlPosition,
  MapControl,
} from "@vis.gl/react-google-maps";
import marker from "../assets/marker.png";
import ArrowRight from "../assets/svgs/arrowRight";
import Arrowleft from "../assets/svgs/arrowLeft";
import ArrowDown from "../assets/svgs/arrowDown";
import ArrowUp from "../assets/svgs/arrowUp";
import { moveMap } from "../assets/MapFN";

const Home = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [position, setPosition] = useState({ lat: 38.0406, lng: -84.5037 });

  const apiUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:8080"
      : import.meta.env.REACT_APP_BACKEND_URL ||
        "https://geodash-world-server-development.onrender.com";

  // console.log("API URL:", apiUrl);

  console.log(position);

  useEffect(() => {
    fetch(`${apiUrl}/api/landmarks`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json();
      })
      .then((data) => {
        // console.log(data);
        setPointsOfInterest(data);
      })
      .catch((err) => console.error("Failed to fetch landmarks", err));
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        // This is the map component that can be customized
        style={{ width: "70vh", height: "70vh", marginLeft: "26rem" }}
        defaultCenter={{ lat: 38.0406, lng: -84.5037 }}
        center={position}
        defaultZoom={10.4}
        mapId="90d6d90b957e9186" // This helps with styling default points of interest
        gestureHandling={"cooperative"}
        disableDefaultUI={true}
      >
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <div className="Control-Circle">
            <div className="horizontalArrows">
              <Arrowleft
                className="arrowHorizontal"
                fn={() => {
                  moveMap(position, setPosition, "left");
                }}
              />
            </div>

            <div className="verticalArrows">
              <ArrowUp
                className="ArrowVertical"
                fn={() => {
                  moveMap(position, setPosition, "up");
                }}
              />
              <ArrowDown
                className="ArrowVertical bottomArrow"
                fn={() => {
                  moveMap(position, setPosition, "down");
                }}
              />
            </div>
            <div className="horizontalArrows" >
              <ArrowRight
                className="arrowHorizontal rightArrow"
                fn={() => {
                  moveMap(position, setPosition, "right");
                }}
              />
            </div>
          </div>
        </MapControl>

        <PoiMarkers
          pois={pointsOfInterest}
          selectedPoi={selectedPoi}
          setSelectedPoi={setSelectedPoi}
        />
      </Map>
    </APIProvider>
  );
};

const PoiMarkers = ({ pois, selectedPoi, setSelectedPoi }) => {
  const customIcon = (poi) => {
    if (poi.icontype !== "default") {
      return <img src={marker} width={50} height={50} />;
    } else {
      return (
        <Pin background={"gold"} glyphColor={"black"} borderColor={"black"} />
      );
    }
  };

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi._id}
          position={poi.location}
          onClick={() => setSelectedPoi(poi)} // Set the selected marker on click
        >
          {customIcon(poi)}
        </AdvancedMarker>
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
