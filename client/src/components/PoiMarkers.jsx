import { useState } from "react";
import {
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import marker from "../assets/marker.png";


const PoiMarkers = ({ pois }) => {
  const [selectedPoi, setSelectedPoi] = useState(null);
    
  return (
    <>
      {pois.map((poi) => (
        <Marker
          key={poi._id}
          position={poi.location}
          onClick={() => setSelectedPoi(poi)} // Set the selected marker on click
					icon={{url: marker, scaledSize: { width: 50, height: 50 }}}
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

export default PoiMarkers