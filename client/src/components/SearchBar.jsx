import React from 'react'

const SearchBar = ({searchBoxRef, clearSearch}) => {
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
