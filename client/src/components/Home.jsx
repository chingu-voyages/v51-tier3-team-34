import MapContainer from "./MapContainer";
import { Marker, DirectionsRenderer} from "@react-google-maps/api"
import PoiMarkers from "./PoiMarkers";

const Home = () => {
  return (
      <MapContainer >
        {/* Add a marker if a place is selected
        {markerPosition && <Marker position={markerPosition} />} */}
        {/* <PoiMarkers/> */}

        {/* Render Directions on the map */}
        {/* {directionsResponse && <DirectionsRenderer directions={directionsResponse} />} */}
      </MapContainer>
  );
};

export default Home;
