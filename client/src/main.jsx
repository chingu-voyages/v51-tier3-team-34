import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router.jsx";
import { MapProvider } from "./context/MapContext.jsx"
import { LoadScriptNext } from "@react-google-maps/api";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";

const libraries = ["places"]
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadScriptNext
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<div>Loading...</div>} // Provide loading element for better UX
    >
      <MapProvider>
        <UserProvider>
          <Router />
        </UserProvider>
      </MapProvider>
    </LoadScriptNext>
  </React.StrictMode>,
);
