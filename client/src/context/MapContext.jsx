import React, { createContext, useRef, useCallback, useState } from 'react';

// Create a Context for the map instance
export const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false); // Add loading state

  const onLoad = useCallback((map) => {
    mapRef.current = map; // Save map instance in ref
    setIsMapLoaded(true); // Set the loading state to true when the map is loaded
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null; // Clean up map instance on unmount
    setIsMapLoaded(false); // Optionally reset loading state on unmount
  }, []);

  return (
    <MapContext.Provider value={{ mapRef, onLoad, onUnmount, isMapLoaded }}>
      {children}
    </MapContext.Provider>
  );
};