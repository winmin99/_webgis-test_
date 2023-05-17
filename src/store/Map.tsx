import MapContext from "./MapContext";
import React, {CSSProperties, ReactNode, useEffect, useState} from "react";

import {fromLonLat, toLonLat} from "ol/proj";
import {YeongjuPosition} from "../common/position";
import {Map, View} from "ol";
import {Vector as VectorLayer} from "ol/layer";
import {Vector as VectorSource} from "ol/source";
import {GeoJSON} from "ol/format";
import {Stroke, Style} from "ol/style";
import {default as defaultInteractions} from "../common/interaction"
import {default as epsg5187} from "../common/projection"
import "./Map.scss"

declare global {
  interface Window {
    kakao: any;
  }
}

interface OlMapProps {
  children?:React.ReactNode;
  style?: CSSProperties; // add this line
}

const AllMap = ({children}: OlMapProps): JSX.Element => {
  const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187");//fromLonLat은 첫번째 인자로 들어온좌표(경도와 위도 순으로 들어와야됨) 를 두번째 인자로 지정한 좌표로 바꿔준다.
  const [mapState, setMapState] = useState({})

  useEffect(() => {
    document.querySelector("#olMap > .ol-viewport")?.remove();
    const olMap = new Map({
      interactions: defaultInteractions, //맵 옵션 적용
      layers: [
        // new TileLayer({
        //   source: new OSM(),
        //   visible: false, // 지도를 숨기기 위해 visible 속성을 false로 설정
        // }),
        new VectorLayer({
          //관 정보를 url로 받아옴
          source: new VectorSource({
            format: new GeoJSON(),
            url: "http://djgis.iptime.org:8000/geoserver/yeongju_a/wfs?typename=yeongju_a%3Aviw_wtl_pipe_lm&service=WFS&version=2.0.0&request=GetFeature&outputFormat=application%2Fjson&propertyName=geom",
            // features: [circleFeature],
          }),
          style: new Style({
            stroke: new Stroke({
              color: "#fc04a5",
              width: 1.5,
            }),
          }),
        }),
      ],
      target: "olMap",
      view: new View({
        center: epsg5187Coord, //중심좌표
        zoom: 12.3, //기본 줌레벨
        constrainResolution: false,
        constrainRotation: false,
        minZoom: 5.3, //최소 줌레벨
        maxZoom: 14.3, //최대 줌레벨
        projection: epsg5187, //EPSG:5187 좌표로 변환
        rotation: -0.02307, //맵을 회전시킴
      }),
    });
    document.querySelector("#kakaomap > div")?.remove();
    const container = document.getElementById("kakaoMap");
    const options = {
      center: new window.kakao.maps.LatLng(36.80561042120899,
        128.6239256437062),
      level: 3,
    };
    const kakaoMap = new window.kakao.maps.Map(container, options);

    const markerPosition = new window.kakao.maps.LatLng(
      36.80561042120899,
      128.6239256437062
    );
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(kakaoMap);

    const view = olMap.getView();
    let currentZoom:number | undefined
    olMap.getView().on("change:center", (e:any) => {
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
        const level:number =view.getZoom() as number//olMap의 줌레벨을 가져옴 현재 기본 12.3
        console.log(level)
        const kakaolevel = kakaoMap.getLevel()//KakaoMap의 줌레벨을 가져옴 현재 기본 3
        console.log(kakaolevel)
        kakaoMap.setLevel(15.3 - level)//kakomap과 olmap 의 줌을 연동하게 만들어줌
        console.log(`ol: ${view.getZoom()} 카카오1: ${kakaolevel}`);
        currentZoom = level;
      }
    });
    setMapState({olMap,kakaoMap})
    return () => olMap.setTarget(undefined)
  }, []);
  return (
    <MapContext.Provider value={{mapState}}>
      <div id="olMap" className="olmap"></div>
      <div id="kakaoMap" className="kakaomap"></div>
      {children}
    </MapContext.Provider>
  )
}
export default AllMap