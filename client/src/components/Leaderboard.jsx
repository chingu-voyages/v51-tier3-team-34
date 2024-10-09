import React, { useState } from "react";
import "../styles/leaderboard.css";

const Leaderboard = () => {
  const [showFullList, setShowFullList] = useState(false);

  // Replace this with actual data
  const users = [
    { id: 1, name: "User 1", img: "user1.png", score: 500, },
    { id: 2, name: "User 2", img: "user2.png", score: 400, },
    { id: 3, name: "User 3", img: "user3.png", score: 300, },
    { id: 4, name: "User 4", img: "user4.png", score: 200, },
    { id: 5, name: "User 5", img: "user5.png", score: 100, },
    { id: 6, name: "User 6", img: "user6.png", score: 50, },
    { id: 7, name: "User 7", img: "user7.png", score: 40, },
    { id: 8, name: "User 8", img: "user8.png", score: 30, },
    { id: 9, name: "User 9", img: "user9.png", score: 20, },
    { id: 10, name: "User 10", img: "user10.png", score: 10, },
  ];

  const toggleLeaderboard = () => {
    setShowFullList(!showFullList);
  }; 

  const displayedUsers = showFullList ? users : users.slice(0, 5);

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Ranking</h2>
        <button className="full-leaderboard-btn" onClick={toggleLeaderboard}>
          {showFullList ? "Show Top 5" : "View Full Leaderboard"}
        </button>
      </div>
      <table className="leaderboard-table">
        <tbody>
          {displayedUsers.map((user, index) => (
            <tr key={user.id} className="leaderboard-row">
              <td className="rank">{index + 1}</td>
              <td className="profile-pic">
                <img src={user.img} />
              </td>
              <td className="user-name">{user.name}</td>
              <td className="score">
                {user.score} <span className="points">points</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default Leaderboard;
