import React from 'react'

const MapButtons = ({togglePolyLines, visibleTransit}) => {
  return (
    <div>
			<input type='text' placeholder='search'></input>
      
			<button onClick={togglePolyLines}>
				{visibleTransit ? "Hide Transit Map" : "Show Transit Map"}
			</button>
      
			<button>Plan Routes</button>
    
		</div>
  )
}

export default MapButtons
