import React from "react";

const MapButtons = ({
  togglePolyLines,
  visibleTransit,
  clearSearch,
  showRoute,
  setShowRoute,
}) => {
  return (
    <div>
      <button onClick={togglePolyLines}>
        {visibleTransit ? "Hide Transit Map" : "Show Transit Map"}
      </button>

      <button
        onClick={() => {
          setShowRoute(!showRoute);
          clearSearch();
        }}
      >
        {showRoute ? "Cancel planning route" : "Plan Routes"}
      </button>
    </div>
  );
};

export default MapButtons;
