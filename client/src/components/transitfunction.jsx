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


