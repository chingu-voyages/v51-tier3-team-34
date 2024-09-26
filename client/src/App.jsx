import { useState, useEffect } from 'react'
import JSZip from 'jszip'
import Papa from 'papaparse'
import './App.css'
import axios from "axios";
import {
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

// LAT and LNG place markers where they should be. Type and imgURL are for implementing custom images or icons.  
const pointsOfInterest = [
  {
    key: "maryToddHouse",
    location: { lat: 38.05462, lng: -84.49666 },
    type: "default",
    imgURL: "",
  },
  {
    key: "ashland",
    location: { lat: 38.030517, lng: -84.484004 },
    type: "default",
    imgURL: "",
  },
  {
    key: "huntMorganHouse",
    location: { lat: 38.04965, lng: -84.49588 },
    type: "default",
    imgURL: "",
  },
  {
    key: "lexingtonCemetery",
    location: { lat: 38.06149, lng: -84.49049 },
    type: "default",
    imgURL: "",
  },
  {
    key: "waveland",
    location: { lat: 37.95511, lng: -84.54357 },
    type: "default",
    imgURL: "",
  },
  {
    key: "historicMorrisonHall",
    location: { lat: 38.039401, lng: -84.501246 },
    type: "default",
    imgURL: "",
  },
  {
    key: "oldFayetteCountyCourthouse",
    location: { lat: 38.04798, lng: -84.49688 },
    type: "default",
    imgURL: "",
  },
  {
    key: "gratzPark",
    location: { lat: 38.05145, lng: -84.4963 },
    type: "default",
    imgURL: "",
  },
  {
    key: "cheapsidePark",
    location: { lat: 38.04854, lng: -84.49685 },
    type: "default",
    imgURL: "",
  },
  {
    key: "trianglePark",
    location: { lat: 38.0492, lng: -84.4994 },
    type: "default",
    imgURL: "",
  },
];


function App() {
  // This relates to the transit layer state
  const [mapInstance, setMapInstance] = useState(null);

  // This is for creating our stops because the transit layer doesn't display them
  const [stops, setStops] = useState([]);

  // This is for creating the shapes, connecting the stops together into routes
  const [shapes, setShapes] = useState([])

  // This will be triggered on load
  const onMapLoad = (map) => {
    console.log("Map Loaded: ", map)
    setMapInstance(map);

    // This adds the transit layer when the map is loaded
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  };

  const fetchGTFSData = async () => {
    const response = await axios.get("/google_transit.zip", {
      responseType: "arraybuffer",
    });
    const zip = new JSZip();
    const content = await zip.loadAsync(response.data);

    // Extract stop.txt
    const stopsFile = content.files["stops.txt"];
    const stopsText = await stopsFile.async("text");

    // Parse stops.txt
    Papa.parse(stopsText, {
      header: true,
      skipEmptyLines: true, // This is important because there is an empty line in the data that throws an error
      complete: (results) => {
        const stopsData = results.data.map((stop) => ({
          id: stop.stop_id,
          name: stop.stop_name,
          lat: parseFloat(stop.stop_lat),
          lon: parseFloat(stop.stop_lon),
        }));
        setStops(stopsData);
      },
    });

    // Extract shapes.txt
    const shapesFile = content.files["shapes.txt"];
    const shapesText = await shapesFile.async("text");

    // Parse shapes.txt
    Papa.parse(shapesText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const shapesData = results.data.map((shape) => ({
          shape_id: shape.shape_id,
          lat: parseFloat(shape.shape_pt_lat),
          lng: parseFloat(shape.shape_pt_lon),
          sequence: parseInt(shape.shape_pt_sequence, 10),
        }));
        setShapes(shapesData);
      },
    });
  };

  //TESTING - can be delete if needed
  // const fetchAPI = async () => {
  //   const response = await axios.get("http://localhost:8080/api");
  //   setArray(response.data.fruits)
  //   console.log(response.data.fruits);
  // };

  useEffect(() => {
    // fetchAPI();
    fetchGTFSData();
  }, []);

  useEffect(() => {
    if (!mapInstance) {
      console.log("Map instance is NOT ready yet...")
      return
    }

    const delayMapInstance = setTimeout(() => {
      if (shapes.length > 0) {
        console.log("drawing bus route with map instance: ", mapInstance)
        drawBusRoute(mapInstance, shapes)
      }
    }, 1000)

    return () => clearTimeout(delayMapInstance)

  }, [mapInstance, shapes])

  return (
    <>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            // This is the map component that can be customized
            mapContainerStyle={{
              width: "70vh",
              height: "70vh",
              marginLeft: "26rem",
            }}
            center={{ lat: 38.0406, lng: -84.5037 }}
            zoom={11.9}
            mapId="90d6d90b957e9186" // This helps with styling default points of interest
            gestureHandling={"cooperative"}
            disableDefaultUI={false}
            onLoad={onMapLoad}
          >
            <PoiMarkers pois={pointsOfInterest} />
            <BusStops stops={stops} />
          </GoogleMap>
      </LoadScript>
    </>
  );
}

const PoiMarkers = ({ pois }) => {
  return (
    // I (Cody) wasn't able to get this code block to work yet.
    // The idea is that if type = default then a regular marker will be displayed.
    // I was following this part of the google documentation: https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
    <>
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          icon={
            poi.type === "custom" ? (
              {
                url: poi.imgURL, // Custom image
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
        ></AdvancedMarker>
      ))}
    </>
  );
};

const BusStops = ({ stops }) => {
  // This is where we can make custom markers for bus stops if we would like
  return (
    <>
      {/* {stops.map((stop) => (
        <AdvancedMarker
          key={stop.id}
          position={{ lat: stop.lat, lng: stop.lon }}
          label={stop.name}
        />
      ))} */}
    </>
  )
}

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
    // });

    // Adds an info window to the displayed route when clicked
    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${routeId}</strong>`
    })

    routePolyLine.addListener("click", function () {
      infoWindow.setPosition(routePath[0]) // Opens the window at the start of the route
      infoWindow.open(map)
    })
  })
}

export default App