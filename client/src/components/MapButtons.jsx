import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const MapButtons = ({
  togglePolyLines,
  visibleTransit,
  clearSearch,
  showRoute,
  setShowRoute,
}) => {
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <button disabled={!currentUser} onClick={togglePolyLines}>
        {visibleTransit ? "Hide Transit Map" : "Show Transit Map"}
      </button>

      <button
        disabled={!currentUser}
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
