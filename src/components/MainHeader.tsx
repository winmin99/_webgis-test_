import React, {useState} from "react";
import classes from "./MainHeader.module.css";
import Roadview from "./map/Roadview"
import MainMap from "./map/MainMap"
import * as S from "./map/KakaoSearch.styled";
import Satellite from "./map/Satellite";
import StrokeMap from "./map/StrokeMap";
import PolygonMap from "./map/Polygon";
import MeasureMap from "./map/MeasureMap";


export interface propsType {
  searchKeyword: string
}
const MainHeader = (): JSX.Element => {
  const [showSatellite, setShowSatellite] = useState(false);
  const [showRoadview, setShowRoadview] = useState(false);
  const [showPlusMap, setShowPlusMap] = useState(false);
  const [showStroke, setShowStroke] = useState(false);
  const [showPolygon, setShowPolygon] = useState(false);
  const [showTestMap, setShowTestMap] = useState(false);
  // 입력 폼 변화 감지하여 입력 값 관리
  const [Value, setValue] = useState("");
  // 제출한 검색어 관리
  const [Keyword, setKeyword] = useState("");

  // 입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
  const keywordChange = (e: { preventDefault: () => void; target: { value: string }; }) => {
    e.preventDefault();
    setValue(e.target.value);
  }
  // 제출한 검색어 state에 담아주는 함수
  const submitKeyword = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setKeyword(Value);
    setValue("")
  }
  const valueChecker = () => {
    if (Value === "") {
      alert ("검색어를 입력해주세요7.")
    }
  }

  const handleTitleClick = () => {
    window.location.reload();
  }
  const handleRoadviewClick = () => {
    setShowRoadview(prevState => !prevState);
  }
  const handlePlusMapClick = () => {
    setShowPlusMap(prevState => !prevState);
  }
  const handleStrokeMapClick = () => {
    setShowStroke(prevState => !prevState)
  }
  const handlePolygonMapClick = () => {
    setShowPolygon(prevState => !prevState);
  }
  const handleTestMapClick = () => {
    setShowTestMap(prevState => !prevState);
  }

  const handleSatelliteClick = () => {
    setShowSatellite((prev) => !prev);
  }

  return (
    <>
      <header className={classes["main-header"]}>
        <h1 onClick={handleTitleClick}>영주시 상수 웹조회시스템</h1>
        <input
          type="text"
          value={Value}
          id="keyword"
          className={classes["search-input"]}
          onChange={ keywordChange }
          placeholder="검색어를 입력해주세요..."
        />
        <button id="submit_btn" type="submit" onClick={submitKeyword} className={classes.submit_btn}>
          <S.SearchIcon />
        </button>
        <nav className={classes.navbar}>
          <ul>
            <li className={showSatellite ? classes.active : ""}  onClick={handleSatelliteClick}>{showSatellite ? "일반지도" : "위성50%"}</li>
            <li className={showRoadview ? classes.active : ""} onClick={handleRoadviewClick}>{showRoadview ? "돌아가기" : "로드뷰"}</li>
            {/*<li className={showPlusMap ? classes.active : ""} onClick={handlePlusMapClick}>{showPlusMap? "돌아가기": "플러스지도"}</li>*/}
            <li className={showStroke ? classes.active : ""} onClick={handleStrokeMapClick}>{showStroke? "돌아가기": "카카오선"}</li>
            {/*<li className={showPolygon ? classes.active : ""} onClick={handlePolygonMapClick}>{showPolygon? "돌아가기": "선"}</li>*/}
            <li className={showTestMap ? classes.active : ""} onClick={handleTestMapClick}>{showTestMap ? "숨기기" : "거리/면적"}</li>
          </ul>
        </nav>
      </header>
      {showSatellite && <Satellite/>}
      {showRoadview && <Roadview/>}
      {/*{showPlusMap && <PlusMap/>}*/}
      {showStroke && <StrokeMap/>}
      {showPolygon && <PolygonMap />}
      {showTestMap && <MeasureMap />}
      <MainMap searchKeyword={ Keyword } />
    </>
  );
};

export default MainHeader;
