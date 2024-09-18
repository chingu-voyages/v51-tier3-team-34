import React from "react";
import { createRoot } from "react-dom/client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const App = () => (
  <APIProvider apiKey={"AIzaSyB7mJ6aADlsxkm2hy10OV5aW1Xh_WdOgio"}>
    <h1 style={{ textAlign: "center", marginLeft: "28rem" }}>Hello Chingu!!</h1>
    <Map
      style={{ width: "70vh", height: "70vh", marginLeft: "26rem" }}
      defaultCenter={{ lat: 38.03, lng: -84.51 }}
      defaultZoom={11.9}
      mapId="90d6d90b957e9186"
      gestureHandling={"cooperative"}
      disableDefaultUI={true}
    />
  </APIProvider>
);

  //TESTING - can be delete if needed
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits)
    console.log(response.data.fruits);
  };

  useEffect(()=> {
    fetchAPI();
  }, [])

const root = createRoot(document.querySelector("#root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 export default App