import React, { useState, useEffect } from "react";

const ScavengerProgress = ({ huntLocations, userProgress }) => {
  const [endGame, setEndGame] = useState(false);
  const [selectLocation, setSelectLocation] = useState(null);

  useEffect(() => {
    // Check for end game condition
    if (userProgress < 10) {
      setEndGame(false);
      const location = huntLocations.find(
        (location) => location.routeIndex === userProgress + 1,
      );
      setSelectLocation(location);
    } else {
      setEndGame(true);
    }
  }, [userProgress, huntLocations]); // Dependency array

  const progress = userProgress * 10;

  return (
    <>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress">Progress: {progress}%</div>

      {!endGame ? (
        <div className="hints">
          <h2>Find this location!</h2>
          <p>
            <strong>Here is your hint</strong>
          </p>
          <p>{selectLocation ? selectLocation.hint : "No hint available"}</p>
        </div>
      ) : (
        <div>
          <p>You completed our scavenger hunt! Thanks for playing.</p>
        </div>
      )}
    </>
  );
};

export default ScavengerProgress;
