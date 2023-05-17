import React, { useState } from "react";
import "./Satellite2.scss"

interface Props {
  onChangeMapType: (mapType: string) => void;
}

const MapControl = ({ onChangeMapType }: Props): JSX.Element => {
  const [mapType, setMapType] = useState("roadmap");

  const handleClick = () => {
    const newMapType = mapType === "roadmap" ? "skyview" : "roadmap";
    setMapType(newMapType);
    onChangeMapType(newMapType);
  };

  return (
    <div className="div">
      <button className="button" onClick={handleClick}>
        {mapType === "roadmap" ? "위성지도" : "일반지도"}
      </button>
    </div>
  );
};

export default MapControl;
