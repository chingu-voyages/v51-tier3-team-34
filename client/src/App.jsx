import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios";
import {
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";

function App() {
  const [count, setCount] = useState(0)
  const [array, setArray] = useState([])

  //TESTING - can be delete if needed
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits)
    console.log(response.data.fruits);
  };

  const fetchLocationAPI = async () => {
    const response = await axios.get("http://localhost:8080/historical-landmarks");
    console.log(response.data);
  };

  useEffect(()=> {
    fetchLocationAPI();
  }, [])

  return (
    <>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          style={{ width: "70vh", height: "70vh", marginLeft: "26rem" }}
          defaultCenter={{ lat: 38.0406, lng: -84.5037 }}
          defaultZoom={11.9}
          gestureHandling={"cooperative"}
          disableDefaultUI={true}
        />
      </APIProvider>
    </>
  );
}

export default App