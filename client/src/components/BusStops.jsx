import { useState} from 'react'


const BusStops = ({stops}) => {
  // This is where we can make custom markers for bus stops if we would like
  return (
    <>
      {/* {stops.map((stop) => (
        <AdvancedMarker
          key={stop.id}
          position={{ lat: stop.lat, lng: stop.lon }}
          label={stop.name}
        />
      ))} */}
    </>
  )
}

export default BusStops