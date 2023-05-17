import React, { useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import classes from "./OlMap.module.css";
import { Vector as VectorSource } from "ol/source";
import { Stroke, Style } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { fromLonLat, toLonLat } from "ol/proj";
import { GeoJSON } from "ol/format";
import { YeongjuPosition } from "../../common/position";
import MapBoard from "./MapBoard";
import MapInteraction, { HomeButton } from "./MapInteraction";
import { default as epsg5187 } from "../../common/projection";
import { default as defaultInteractions } from "../../common/interaction";

const OlMap = (): JSX.Element => {
  const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187"); //fromLonLat은 첫번째 인자로 들어온좌표(경도와 위도 순으로 들어와야됨) 를 두번째 인자로 지정한 좌표로 바꿔준다.
  const [mapState, setMapState] = useState(new Map({}));

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
              color: "#0033ff",
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

    const view = olMap.getView();
    const center = view.getCenter();

    console.log(center, view);

    olMap.getView().on("change", () => {
      const view = olMap.getView();
      const zoom = view.getZoom();
      console.log(`ol:${zoom}`);
    });
    //중심점이 변할때 발생하는 이벤트
    olMap.getView().on("change:center", (e) => {
      const center = e.target.getCenter(); //이벤트 발생시 중심좌표
      const epsg4326center = toLonLat(center, "EPSG:5187"); // toLonLat은 첫번째로 들어온 인자(경도와 위도 순으로 들어와야됨) 가들어오고 두번째 인자에는 첫번째 인자좌표가 어떤 좌표인지 알려줘야함)
      console.log("str:", epsg4326center);
    });
    setMapState(olMap);
  }, []);

  return (
    <>
      <div id="olMap" className={classes.map}></div>
      <MapInteraction>
        <HomeButton map={mapState} position={YeongjuPosition} />
      </MapInteraction>
      <MapBoard map={mapState} />
    </>
  );
};

export default OlMap;
