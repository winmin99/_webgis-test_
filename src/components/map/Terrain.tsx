import React, {useState} from "react";
import "./Terrain.scss"

interface Props {
  onChangeMapType: (mapType: string) => void;
}

const Terrain = ({onChangeMapType}:Props):JSX.Element => {
  const [mapType, setMapType] = useState("roadmap")

  const changeHandler = () => {
    const newMapType = mapType === "roadmap" ? "terrain" : "roadmap";
    setMapType(newMapType);
    onChangeMapType(newMapType);
  }

  return (
    <div className="terrain">
      <button className="button" onClick={changeHandler}>
        {mapType === "roadmap" ? "지형지도" : "일반지도"}
      </button>
    </div>
  )
}

export default Terrain