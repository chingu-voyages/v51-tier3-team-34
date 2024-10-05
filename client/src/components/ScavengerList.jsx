import React from 'react'

const ScavengerList = ({huntLocations, userProgress}) => {

  const sortedLocations = huntLocations.sort((a, b) => a.routeIndex - b.routeIndex)

  return (
    <>
    <h3>Scavenger Hunt Locations</h3>
    <ul>
        {sortedLocations.map((location) => 
          <li key={location._id}>
            {location.routeIndex <= userProgress ? <strong>{location.name}</strong> : <strong>*******</strong>}
            <p style={{fontStyle: 'italic'}}>{location.routeIndex <= userProgress ? location.hint : "********************"}</p>
          </li>
        )}
    </ul> 
    </>
  )
}

export default ScavengerList
