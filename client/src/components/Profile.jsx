import React, {useContext, useState} from 'react'
import images from "../assets/avatar/images"
import { UserContext } from '../context/UserContext'
import "../styles/profile.css"

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const {currentUser} = useContext(UserContext)
  const [showImages, setShowImages] = useState(false)

  
  const updateProfile = async (prop, value)=> {
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
      console.log(data)
      return data;
  
  } catch (error) {
    console.error('Error updating image:', error.message);
    // Optionally re-throw or handle the error further
    throw error; // Re-throw if you want to propagate the error
  }
  }

  return (
    <div className='body'>
      <h2>Profile Page</h2>
      <div className='profile'>
        <div className="images">
          <img src={images[currentUser.img]} alt='avatar '/>
          <button onClick={()=>setShowImages(!showImages)}>
            {showImages ? "Cancel transaction" :"Change profile picture"}
          </button>
          {showImages && 
            <div className='all-images' >
              {Object.keys(images).map((key, index) => (
                <img key={index} src={images[key]} alt={key} onClick={()=>updateProfile("img", key)} />
              ))}
              <a href="http://www.freepik.com">Designed by Freepik</a>
            </div>
          }
        </div>

      </div>
      <div className='achievement-section'></div>
    <div>
      WIP - able to select your avatar pic, and can change username. See the email you have
    </div>
    </div>
    // If don't have time to have be able to upload picture for profile image, could allow users to choose their images instead
    // <div>
    //   {Object.keys(images).map((key, index) => (
    //     <img key={index} src={images[key]} alt={key} />
    //   ))}
      
    // </div>
    
  )
}

export default Profile
