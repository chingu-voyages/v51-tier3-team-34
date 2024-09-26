import { useEffect } from 'react'
import BusStops from './BusStops'
import { drawBusRoute } from './transitfunction'
import { GoogleMap } from '@react-google-maps/api'

const TransitMap = ({mapInstance, setMapInstance, mapStyles, shapes, stops}) => {
	// This will be triggered on Mapload
  const onMapLoad = (map) => {
    console.log("Map Loaded: ", map)
    setMapInstance(map);
  
    // This adds the transit layer when the map is loaded
    const transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
  };

	useEffect(() => {
    if (!mapInstance) {
      console.log("Map instance is NOT ready yet...")
      return
    }

    const delayMapInstance = setTimeout(() => {
      if (shapes.length > 0) {
        console.log("drawing bus route with map instance: ", mapInstance)
        drawBusRoute(mapInstance, shapes)
      }
    }, 1000)

    return () => clearTimeout(delayMapInstance)

  }, [mapInstance, shapes])

  return (
		<GoogleMap
    	// This is the map component that can be customized
      mapContainerStyle={{
        width: "70vh",
        height: "70vh",
        marginLeft: "26rem",
      }}
      center={{ lat: 38.0406, lng: -84.5037 }}
      zoom={11.9}
      mapId="90d6d90b957e9186" // This helps with styling default points of interest
      gestureHandling={"cooperative"}
      disableDefaultUI={false}
      onLoad={onMapLoad}
      options={{ styles: mapStyles }}
    >

    	{/*Bus stops component is for customize UI of bus stop markers */}
      <BusStops stops={stops} />

  	</GoogleMap>
  )
}

export default TransitMap
