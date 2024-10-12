import React, { createContext, useRef, useCallback } from 'react';

// Create a Context for the map instance
export const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;  // Save map instance in ref
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;  // Clean up map instance on unmount
  }, []);

  return (
    <MapContext.Provider value={{ mapRef, onLoad, onUnmount }}>
      {children}
    </MapContext.Provider>
  );
};