import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router.jsx";
import { LoadScriptNext } from "@react-google-maps/api";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadScriptNext
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <Router />
    </LoadScriptNext>
  </React.StrictMode>,
);
