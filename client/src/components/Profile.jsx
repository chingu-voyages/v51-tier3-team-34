import React, {useContext, useState, useEffect} from 'react'
import images from "../assets/avatar/images"
import edit from "../assets/edit.png"
import cancel from "../assets/cancel.png"
import points from "../assets/points.png"
import explorerGreen from "../assets/badges/explorer_green.png";
import explorerBronze from "../assets/badges/explorer_bronze.png";
import explorerSilver from "../assets/badges/explorer_silver.png";
import explorerGold from "../assets/badges/explorer_gold.png";
import explorerGrayed from "../assets/badges/explorer_grayed.png";
import { UserContext } from '../context/UserContext'
import "../styles/profile.css"

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const {currentUser, updateUser} = useContext(UserContext)
  const [showImages, setShowImages] = useState(false)
  const [showChangeUsername, setShowChangeUsername] = useState(true)
  const [updatedUsername, setUpdateUsername] = useState("")
  const [pointsDiff, setPointsDiff] = useState(0)
  const [percentDiff, setPercentDiff] = useState(0)
  const [badge, setBadge] = useState(explorerGrayed)

  useEffect(() => {
    const updateBadge = () => {
      let pointsDiff, percentDiff;
      if (currentUser.points === 0) {
        pointsDiff = 1;
        percentDiff = 0;
        setBadge(explorerGrayed);
      } else if (currentUser.points >= 1 && currentUser.points < 200) {
        pointsDiff = 200 - currentUser.points;
        percentDiff = (currentUser.points - 1) / 300;
        setBadge(explorerGreen);
      } else if (currentUser.points >= 200 && currentUser.points < 500) {
        pointsDiff = 500 - currentUser.points;
        percentDiff = (currentUser.points - 200) / 300;
        setBadge(explorerBronze);
      } else if (currentUser.points >= 500 && currentUser.points < 800) {
        pointsDiff = 800 - currentUser.points;
        percentDiff = (currentUser.points - 500) / 300;
        setBadge(explorerSilver);
      } else {
        setBadge(explorerGold);
      }

      // Update the state after calculations
      setPointsDiff(pointsDiff);
      setPercentDiff(percentDiff * 100);
    };

    updateBadge(); // Call the function whenever points change
  }, [currentUser.points]); // Only run effect when `currentUser.points` changes

  
  const handleUpdate = async (prop, value)=> {
    try {
      const response = await fetch(`${apiUrl}/api/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({[prop] : value}),
      });
      const data = await response.json()
      updateUser(data.user)
  
    } catch (error) {
      console.error('Error updating image:', error.message);
    }
  }

  const handleUpdateName = async () =>{
    try {
      const response = await fetch(`${apiUrl}/api/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name : updatedUsername }),
      });
      const data = await response.json()
      updateUser(data.user)
      setUpdateUsername("")
  
    } catch (error) {
      console.error('Error updating image:', error.message);
    }
  }
  
  return (
    <div className='profile-body'>
      <h2>Profile Page</h2>
      <div className='profile'>
        <div className="profile-image">
          <img src={images[currentUser.img]} alt='avatar '/>
          <button onClick={()=>setShowImages(!showImages)}>
            {showImages ? "Go Back" :"Change profile picture"}
          </button>
        </div>

        <div className='right-section'>
          {showImages && 
            <div className='select-image'>
              <p>Select a new profile picture</p>
              <div className='all-images' >
                {Object.keys(images).map((key, index) => (
                  <img key={index} src={images[key]} alt={key} onClick={()=>handleUpdate("img", key)} />
                ))}
              </div>
              <a href="http://www.freepik.com">Designed by Freepik</a>
            </div>
          }
          <div className='user-info'>
            <div className='info'>
              <p className='username'><span>{currentUser.name} </span>
                <button onClick={()=>setShowChangeUsername(!showChangeUsername)}>
                  {showChangeUsername ? <img src={cancel} alt="cancel-icon"/> : <img src={edit} alt='edit-icon' />}
                </button>
              </p>
              {showChangeUsername && 
                <label style={{color: "black"}}>
                  Edit your username
                  <input type='text' value={updatedUsername} onChange={(e)=>{setUpdateUsername(e.target.value)}}/>
                  <button onClick={handleUpdateName}>Change</button>
                </label>
              }
              <p><span>{currentUser.email}</span>{showChangeUsername && <span style={{fontStyle: "italic", color: "black"}}> *Can not change email.*</span>}</p>
            </div>
          </div>
          <hr/>
          <div className='points-info'>
            <img src={points} alt="star-icon" />
            <p><span>Total Points Earned: </span> {currentUser.points}</p>
          </div>
          <hr/>
          <div className='achievement-section'>
            <h3>Achievement Badges Progress</h3>
            <div className='tracking'>
              <img src={badge} alt="explorer-badge"/>
              <div className='progress-bar-container'>
                <div className='progress-bar' style={{width: `${percentDiff}%`}}></div>
              </div>
              {badge === explorerGold ? <p>Congratulations for reaching the Gold Explorer Badge!</p> : <p>{pointsDiff} more points to the next badge. </p>}
            </div>
            <div className='description'>
              <p>See Achievements Link for additional badges you can earn!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Profile
