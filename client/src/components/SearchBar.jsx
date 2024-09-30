import React, {useEffect, useRef} from 'react'

const SearchBar = ({mapInstance, setMarkerPosition, clearSearch}) => {
  const searchBoxRef = useRef(null)
  const cityLocation = { lat: 38.0406, lng: -84.5037 };
  const searchRadius = 15000 // Radius in meters (15 km)

    // Search location functionality
  useEffect(() => {
    if (mapInstance && searchBoxRef.current) {
      // Clear any previous listeners to avoid multiple events being fired
      const input = searchBoxRef.current;
      
      // Initialize the SearchBox after the map is loaded
      const searchBox = new window.google.maps.places.SearchBox(input);

      // Remove old listeners if they exist
      const listener = searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const validPlaces = places.filter(place => {
          if (!place.geometry || !place.geometry.location) return false;

          // Calculate the distance from the city center
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(cityLocation.lat, cityLocation.lng),
            place.geometry.location
          );

          // Return true if the place is within the defined radius
          return distance <= searchRadius;
        });

        if (validPlaces.length === 0) {
          alert("No places found within the specificied city limit.")
        }
        const place = validPlaces[0]; // Use the first valid place for the marker
        const location = place.geometry.location;

        // Set the new position and update the map center
        setMarkerPosition({
          lat: location.lat(),
          lng: location.lng(),
        });

        mapInstance.panTo(location);
        mapInstance.setZoom(14);
      });

      // Clean up: Remove the listener when component unmounts or updates
      return ()=> {
        if (listener) window.google.maps.event.removeListener(listener);
      }
    }
  }, [mapInstance, searchBoxRef]);

  return (
    <div>
      <input
        id="search-box"
        type="text"
        placeholder="Search for places"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
        }}
        ref={searchBoxRef}
      />
      <button onClick={clearSearch}>X</button>
    </div>
  )
}

export default SearchBar
