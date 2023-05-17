import React, {useEffect, useRef, useState} from "react";
import {default as defaultInteractions} from "../../common/interaction";
import {Map, View} from "ol";
import {fromLonLat} from "ol/proj";
import {default as epsg5187} from "../../common/projection";
import "./Polygon.scss";
import layers from "../../common/layers";
import {YeongjuPosition} from "../../common/position";
import Draw from 'ol/interaction/Draw';
import VectorSource from "ol/source/Vector";
import {Vector as VectorLayer} from 'ol/layer.js';
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {getLength} from "ol/sphere";
import olMap from "../../common/OlMapTest";

const Polygon = (): JSX.Element => {
  const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187");
  const [measureEnabled, setMeasureEnabled] = useState(false);
  const measureDrawRef = useRef<Draw>(null!);

  useEffect(() => {
    document.querySelector("#olMap > .ol-viewport")?.remove();
    const olMap = new Map({
      interactions: defaultInteractions,
      layers: [
        layers,
        new TileLayer({
          source: new OSM(),
          visible: false, // 지도를 숨기기 위해 visible 속성을 false로 설정
        }),
      ],
      target: "olMap",
      view: new View({
        center: epsg5187Coord,
        zoom: 12.3,
        constrainResolution: false,
        constrainRotation: false,
        minZoom: 5.3,
        maxZoom: 14.3,
        projection: epsg5187,
        rotation: -0.02307, //맵을 회전
      }),
    });

    const formatLength = function (line: any) {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
      }
      return output;
    };

    const layer = new VectorLayer({
      source: new VectorSource(),
    });
    olMap.addLayer(layer);

    // Create the measure distance interaction
    const measureDraw = new Draw({
      type: "LineString",
      source: layer.getSource()!,
    });

    // Add the interaction to the map when enabled
    if (measureEnabled) {
      olMap.addInteraction(measureDraw);
      measureDrawRef.current = measureDraw;
      measureDraw.on("drawend", (event:any) => {
        const geometry = event.feature.getGeometry();
        const length = geometry.getLength();
        console.log(`Length: ${length}`);
      });
    }

    // Remove the interaction from the map when disabled
    if (!measureEnabled && measureDrawRef.current) {
      const source = layer?.getSource();
      source?.clear();
      olMap.removeInteraction(measureDrawRef.current);
    }
    return () => {
      // Cleanup the measure distance interaction when unmounting
      if (measureDrawRef.current) {
        olMap.removeInteraction(measureDrawRef.current);
      }
    };
  }, [measureEnabled]);

  const handleToggleMeasure = () => {
    setMeasureEnabled((prevState) => {
      if (!prevState && measureDrawRef.current) {
        const source = layers.getSource();
        if (source) { // add null check here
          source.clear();
        }
      }
      return !prevState;
    });
  };

  return (
    <div>
      <div id="olMap" className="map"></div>
      <button className="button" onClick={handleToggleMeasure}>
        {measureEnabled ? "Disable Measure" : "Enable Measure"}
      </button>
    </div>
  );
};

export default Polygon;
