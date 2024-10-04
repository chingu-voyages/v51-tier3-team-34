import React, { useEffect } from 'react'

const ScavengerList = ({huntsLocations, userProgress}) => {
  // userProgress = #
  // if routeIndex is less than or equal to userprogress, reveal location name


  useEffect(()=> {

  }, [huntsLocations, userProgress])

  return (
    <ul>
        {huntsLocations.map((location)=> {
            <li>{location.name}</li>
        })}
      
    </ul> 
  )
}

export default ScavengerList
