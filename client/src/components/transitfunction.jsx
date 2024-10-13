import JSZip from "jszip";
import Papa from "papaparse";
import axios from "axios";

export const fetchGTFSData = async ({
  setStops,
  setShapes,
  setRoutes,
  setTrips,
}) => {
  const response = await axios.get("/google_transit.zip", {
    responseType: "arraybuffer",
  });

  const zip = new JSZip();
  const content = await zip.loadAsync(response.data);

  // Extract stops.txt
  const stopsFile = content.files["stops.txt"];
  const stopsText = await stopsFile.async("text");

  // Parse stops.txt
  Papa.parse(stopsText, {
    header: true,
    skipEmptyLines: true,
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

  // Extract routes.txt
  const routesFile = content.files["routes.txt"];
  const routesText = await routesFile.async("text");

  Papa.parse(routesText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const routesData = results.data.reduce((acc, route) => {
        acc[route.route_id] = {
          short_name: route.route_short_name || route.route_long_name,
          long_name: route.route_long_name,
          color: route.route_color ? `#${route.route_color}` : "#0000FF", // Default to blue if no color is provided
        };
        return acc;
      }, {});
      setRoutes(routesData); // Store the route name and color mapping
    },
  });

  // Extract trips.txt (maps shape_id to route_id)
  const tripsFile = content.files["trips.txt"];
  const tripsText = await tripsFile.async("text");

  Papa.parse(tripsText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const tripsData = results.data.reduce((acc, trip) => {
        acc[trip.shape_id] = trip.route_id;
        return acc;
      }, {});
      setTrips(tripsData); // Store the shape_id to route_id mapping
    },
  });
};

export function drawBusRoute(map, shapes, routes, trips, setPolylines) {
  if (!map) {
    console.warn("Map instance is null or undefined.");
    return;
  }

  // Group the shapes by their shape_id
  const shapesByRoute = shapes.reduce((acc, shape) => {
    if (!acc[shape.shape_id]) {
      acc[shape.shape_id] = [];
    }
    acc[shape.shape_id].push({ lat: shape.lat, lng: shape.lng });
    return acc;
  }, {});

  const polylinesArray = [];

  // Draw each route with its respective color
  Object.keys(shapesByRoute).forEach((shapeId) => {
    const routePath = shapesByRoute[shapeId];
    const routeId = trips[shapeId]; // Find the route_id using shape_id
    const routeData = routes[routeId]; // Get route details

    const routeName = routeData.short_name;
    const routeLongName = routeData.long_name;
    const routeColor = routeData.color || "#0000FF"; // Default to blue if no color is found

    const routePolyLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: routeColor, // Set the route color
      strokeOpacity: 0.75, // Adjust opacity as needed
      strokeWeight: 2,
    });

    // Adds the polylines to the map
    routePolyLine.setMap(map);
    polylinesArray.push(routePolyLine);

    // Info window for the route
    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>Bus Route #${routeName}: ${routeLongName}</strong>`,
    });

    // Adds click event to show the info window
    routePolyLine.addListener("click", function () {
      infoWindow.setPosition(routePath[0]); // Open at the start of the route
      infoWindow.open(map);
    });
  });

  setPolylines(polylinesArray);
}
