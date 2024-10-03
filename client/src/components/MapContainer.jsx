import { useContext } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { MapContext } from "../context/MapContext"


const MapContainer = ({children}) => {
  const { onLoad, onUnmount } = useContext(MapContext)

  const mapStyles = [
    // Turn off points of interest that is default in googlemaps.
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ];
 
  return (

    <GoogleMap
        // This is the map component that can be customized
      mapContainerStyle={{
        width: "70vh",
        height: "70vh",
        marginLeft: "26rem",
      }}
      center={{ lat: 38.0406, lng: -84.5037 }}
      zoom={13}
      mapId="90d6d90b957e9186" // This helps with styling default points of interest
      gestureHandling={"cooperative"}
      disableDefaultUI={false}
      options={{ styles: mapStyles }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {children}
    </GoogleMap>

  );
};


export default MapContainer;
