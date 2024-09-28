import React from 'react'

const MapButtons = ({togglePolyLines, visibleTransit, showRoute, setShowRoute}) => {
  return (
    <div>
			<button onClick={togglePolyLines}>
				{visibleTransit ? "Hide Transit Map" : "Show Transit Map"}
			</button>
      
			<button onClick={()=>setShowRoute(!showRoute)}>
				{showRoute ? "Cancel planning route" : "Plan Routes"}
			</button>
    
		</div>
  )
}

export default MapButtons
