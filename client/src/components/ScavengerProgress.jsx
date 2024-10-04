import React, {useState} from 'react'

const ScavengerProgress = ({huntLocations, userProgress}) => {
  const progress = userProgress * 10
  
  const selectLocation = huntLocations.find(location=>
    location.routeIndex === (userProgress + 1)
  )

  return (
    <>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progress">Progress: {progress}%</div>

      <div className='hints'>
        <h2>Find this location!</h2>
        <p><strong>Here is your hint</strong></p>
        <p>{selectLocation.hint}</p>
        
      </div>
    </>
  )
}

export default ScavengerProgress
