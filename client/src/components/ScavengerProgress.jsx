import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const ScavengerProgress = ({ huntLocations, userProgress, userPoints }) => {
  const { currentUser, updateUser } = useContext(UserContext);
  const [endGame, setEndGame] = useState(false);
  const [selectLocation, setSelectLocation] = useState(null);
  const checkIfCompleted = currentUser.completed.includes("sh1")  

  const apiUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:8080"
      : import.meta.env.VITE_BACKEND_URL;

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
      if (!checkIfCompleted) {
        addPoints(userPoints);
      }
    }
  }, [userProgress, huntLocations]); // Dependency array

  const progress = userProgress * 10;

  async function addPoints(newPoints) {
    try {
      currentUser.completed.push("sh1");
      const newCompleted = currentUser.completed;
      const updatedPoints = currentUser.points + newPoints;
      const response = await fetch(`${apiUrl}/api/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          points: updatedPoints,
          completed: newCompleted,
        }),
      });
      const data = await response.json();
      updateUser(data.user);
    } catch (error) {
      console.error("Error updating image:", error.message);
    }
  }

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
          {checkIfCompleted && <p>You have already played before. Points will not be added</p>}
        </div>
      )}
    </>
  );
};

export default ScavengerProgress;
