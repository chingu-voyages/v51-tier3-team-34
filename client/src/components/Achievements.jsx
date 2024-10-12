import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

import "../styles/achievements.css";


import explorerGreen from "../assets/badges/explorer_green.png";
import explorerBronze from "../assets/badges/explorer_bronze.png";
import explorerSilver from "../assets/badges/explorer_silver.png";
import explorerGold from "../assets/badges/explorer_gold.png";
import explorerGrayed from "../assets/badges/explorer_grayed.png";
import quizChampion from "../assets/badges/quiz_champion.png";
import quizGrayed from "../assets/badges/quiz_grayed.png";
import risingStar from "../assets/badges/rising_star.png";
import risingStarGrayed from "../assets/badges/rising_star_grayed.png";
import scavengerMaster from "../assets/badges/scavenger_master.png";
import scavengerMasterGrayed from "../assets/badges/scavenger_grayed.png";
import socialite from "../assets/badges/socialite.png";
import socialiteGrayed from "../assets/badges/socialite_grayed.png";
import speedster from "../assets/badges/speedster.png";
import speedsterGrayed from "../assets/badges/speedster_grayed.png";



const Achievements = () => {
  const { currentUser } = useContext(UserContext);
  const userPoints = currentUser?.points || 0; // Ensure you get the points from the user context
  const userBadges = currentUser?.badges || []; // Access the user's badges array
  const userCompleted = currentUser?.completed || [] // Looked at the completed array on the user object
  
  const badges = [
    {
      name: "Green Explorer",
      requirement: 1,
      earned: userPoints >= 1,
      grayImage: explorerGrayed,
      colorImage: explorerGreen,
      message: "Earned by gaining your first point.",
    },
    {
      name: "Bronze Explorer",
      requirement: 200,
      earned: userPoints >= 200,
      grayImage: explorerGrayed,
      colorImage: explorerBronze,
      message: "Earned by gaining 200 points.",
    },
    {
      name: "Silver Explorer",
      requirement: 500,
      earned: userPoints >= 500,
      grayImage: explorerGrayed,
      colorImage: explorerSilver,
      message: "Earned by gaining 500 points.",
    },
    {
      name: "Gold Explorer",
      requirement: 800,
      earned: userPoints >= 800,
      grayImage: explorerGrayed,
      colorImage: explorerGold,
      message: "Earned by gaining 800 points.",
    },
    {
      name: "Quiz Champion",
      requirement: 300,
      earned: userBadges.includes("Quiz Champion"), // This checks the badges array
      grayImage: quizGrayed,
      colorImage: quizChampion,
      message: "Earned by getting a perfect score on the quiz.",
    },
    {
      name: "Rising Star",
      requirement: 300,
      earned: userPoints >= 300,
      grayImage: risingStarGrayed,
      colorImage: risingStar,
      message: "Earned by gaining 300 points.",
    },
    {
      name: "Scavenger Master",
      requirement: 300,
      earned: userCompleted.includes("sh1"), 
      grayImage: scavengerMasterGrayed,
      colorImage: scavengerMaster,
      message: "Earned by completing the scavenger hunt.",
    },
    {
      name: "Socialite",
      requirement: 300,
      earned: userPoints >= 300,
      grayImage: socialiteGrayed,
      colorImage: socialite,
      message:
        "Earned by sharing a badge or your leaderboard standing on social media.",
    },
    {
      name: "Speedster",
      requirement: 300,
      earned: userBadges.includes("Speedster"), // This checks the user badges array
      grayImage: speedsterGrayed,
      colorImage: speedster,
      message: "Earned by finishing the quiz in under 1 minute.",
    },
  ];

  return (
    <div className="achievements">
      <h2>Your Achievements</h2>
      <div className="badges-container">
        {badges.map((badge) => (
          <div key={badge.name} className="badge">
            <img
              src={badge.earned ? badge.colorImage : badge.grayImage}
              alt={badge.name}
              className="badge-image"
            />
            <div className="badge-info">
              <h3>{badge.name}</h3>
              <p>
                {badge.earned ? "You've earned this badge!" : badge.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
