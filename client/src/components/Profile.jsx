import React, {useContext, useState} from 'react'
import images from "../assets/avatar/images"
import { UserContext } from '../context/UserContext'
import "../styles/profile.css"

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const {currentUser, updateUser} = useContext(UserContext)
  const [showImages, setShowImages] = useState(false)

  
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

  return (
    <div className='profile-body'>
      <h2>Profile Page</h2>
      <div className='profile'>
        <div className="profile-image">
          <img src={images[currentUser.img]} alt='avatar '/>
          <button onClick={()=>setShowImages(!showImages)}>
            {showImages ? "Cancel transaction" :"Change profile picture"}
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
            <p><span>Username </span>{currentUser.name}</p>
            <p><span>Email </span>{currentUser.email}</p>
            <button>Edit</button>
          </div>
          <div className='points-info'>
            <p><span>Total Points Earned</span></p>
          </div>


     
          <div className='achievement-section'></div>
        </div>
      </div>
    </div>
    
  )
}

export default Profile
