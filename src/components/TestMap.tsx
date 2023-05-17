import React, {useContext, useEffect} from "react";
import "./TestMap.scss"
import {YeongjuPosition} from "../common/position";
import {fromLonLat, toLonLat} from "ol/proj";
import MapContext from "../store/MapContext";

declare global {
  interface Window {
    kakao: any;
  }
}

const TestMap = (): JSX.Element => {
  const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187");
  const {mapState} = useContext(MapContext)
  //OlMap 지정
  useEffect(() => {
    document.querySelector("#olMap > .ol-viewport")?.remove();
    const olMap = mapState.olMap
    console.log('랜더링되라')
    //카카오맵을 랜더링
    const container = mapState.container
    const options = mapState.options
    const kakaoMap = mapState.kakaoMap

    const markerPosition = new window.kakao.maps.LatLng(
      36.80561042120899,
      128.6239256437062
    );
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(kakaoMap);

    const view = mapState.olMap.getView();
    let currentZoom: number | undefined
    mapState.olMap.getView().on("change:center", (e: any) => {
      const center = e.target.getCenter();
      const epsg4326center = toLonLat(center, "EPSG:5187");
      console.log("str:", epsg4326center);
      const moveLatLon = new window.kakao.maps.LatLng(
        epsg4326center[1],
        epsg4326center[0]
      );
      console.log(moveLatLon);
      kakaoMap.setCenter(moveLatLon);
      if (view.getZoom() !== undefined && view.getZoom() !== currentZoom) {//줌 레벨 변경시에만 실행되도록 하기위해 필요한 if
        const level: number = view.getZoom() as number//olMap의 줌레벨을 가져옴 현재 기본 12.3
        console.log(level)
        const kakaolevel = kakaoMap.getLevel()//KakaoMap의 줌레벨을 가져옴 현재 기본 3
        console.log(kakaolevel)
        kakaoMap.setLevel(15.3 - level)//kakomap과 olmap 의 줌을 연동하게 만들어줌
        console.log(`ol: ${view.getZoom()} 카카오1: ${kakaolevel}`);
        currentZoom = level;
      }
    });
  }, [])
  return (
    <>
      <div id="olMap" className="olmap"></div>
      <div id="kakaoMap" className="kakaomap"></div>
    </>
  )
}

export default TestMap;