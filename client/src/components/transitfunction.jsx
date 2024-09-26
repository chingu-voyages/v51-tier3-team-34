import JSZip from 'jszip'
import Papa from 'papaparse'
import axios from "axios";

export const fetchGTFSData = async ({setStops, setShapes}) => {
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


export function drawBusRoute(map, shapes) {

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
