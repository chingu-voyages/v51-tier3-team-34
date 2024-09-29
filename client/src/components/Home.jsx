import { useState, useEffect, useMemo, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import marker from "../assets/marker.png";

const libraries = ["places"];
const Home = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  const originRef = useRef();
  const destinationRef = useRef();

  const apiUrl = 
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL

  console.log("API URL:", apiUrl);

  // Center of the map based on current location or default location
  const center = useMemo(() => (
    currentLocation
      ? { lat: currentLocation.lat, lng: currentLocation.lng }
      : { lat: 38.0406, lng: -84.5037 }
  ), [currentLocation]);
  
  useEffect(() => {
    fetch(`${apiUrl}/api/landmarks`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
        return resp.json()
      })
      .then((data) => {
        console.log(data);
        setPointsOfInterest(data);
      })
      .catch((err) => console.error("Failed to fetch landmarks", err));
  }, [apiUrl]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

    // Route Calculation
  const calculateRoute = async () => {
    if (!originRef.current.value || !destinationRef.current.value) return;

    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING, // or WALKING, TRANSIT
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error("Error calculating route", error);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };


  return (
    <Flex position="relative" flexDirection="column" alignItems="center" h="100vh" w="100vw">
      <Box 
        p={4}
        borderRadius="lg" 
        m={4} 
        bgColor="white" 
        shadow="base" 
        minW="container.md" 
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Destination" ref={destinationRef} />
            </Autocomplete>
          </Box>
          <ButtonGroup>
            <Button colorScheme="orange" onClick={calculateRoute}>
              Plan Route
            </Button>
            <IconButton aria-label="clear route" icon={<FaTimes />} onClick={clearRoute} />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>

      <Box 
        position="relative" 
        borderRadius="lg"
        shadow="base"
        mt={6}
        left={0}
        top={0}
        h="100%" 
        w="100%"
      >
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
              // This is the map component that can be customized
            style={{ width: "70vh", height: "70vh", marginLeft: "26rem" }}
            // center={position}
            defaultCenter={{ lat: 38.0406, lng: -84.5037 }}
            defaultZoom={11.9}
            mapId="90d6d90b957e9186" // This helps with styling default points of interest
            gestureHandling={"cooperative"}
            disableDefaultUI={true}
            mapTypeControl={true}
            fullscreenControl={true}
            onLoad={(map) => setMap(map)}
          >
            <AdvancedMarker position={center} />
            {directionsResponse && <DirectionsRenderer map={map} directions={directionsResponse} />}
            <PoiMarkers
              pois={pointsOfInterest}
              selectedPoi={selectedPoi}
              setSelectedPoi={setSelectedPoi}
            />
          </Map>
        </APIProvider>
      </Box>
    </Flex>
  );
};


const PoiMarkers = ({ pois, selectedPoi, setSelectedPoi }) => {

  const customIcon = (poi) => {
    if (poi.icontype !== "default"){
      return <img src={marker} width={50} height={50}/> 
    } else {
      return (
      <Pin
        background={"gold"}
        glyphColor={"black"}
        borderColor={"black"}
      />)
    };
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
