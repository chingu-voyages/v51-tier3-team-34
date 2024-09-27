

const moveMap = (pos, setPosition, direction) => {
    const movement = 0.05; 
   
    console.log("estoy dentro del movepMap");
    
    switch (direction) {
      case 'up':
        setPosition({ ...pos, lat: pos.lat + movement });
        break;
      case 'down':
        setPosition({ ...pos, lat: pos.lat - movement });
        break;
      case 'left':
        setPosition({ ...pos, lng: pos.lng - movement });
        break;
      case 'right':
        setPosition({ ...pos, lng: pos.lng + movement });
        break;
      default:
        break;
    }
  };


export {moveMap}