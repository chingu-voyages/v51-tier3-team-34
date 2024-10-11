import React, {useContext} from 'react'
import images from "../assets/avatar/images"
import { UserContext } from '../context/UserContext'

const Profile = () => {
  const {currentUser} = useContext(UserContext)
  console.log(currentUser)
  return (
    <div>
      WIP - able to select your avatar pic, and can change username. See the email you have
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
