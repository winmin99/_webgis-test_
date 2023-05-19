import React, {Fragment, useEffect, useRef} from "react";
import {Map, Overlay, View} from "ol";
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import {OSM} from "ol/source";
import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style";
import {Draw} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import {LineString, Polygon} from "ol/geom";
import {getArea, getLength} from "ol/sphere";
import {unByKey} from "ol/Observable.js";
import "./MeasureMap.scss"

const MeasureMap = () => {
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;
    const raster = new TileLayer({
      source: new OSM(),
      visible: false
    });

    const source = new VectorSource();

    const vector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
    });

    let sketch:any;


    let helpTooltipElement:any;


    let helpTooltip:any;


    let measureTooltipElement:any;


    let measureTooltip:any;

    const continuePolygonMsg:string = 'Click to continue drawing the polygon';


    const continueLineMsg = 'Click to continue drawing the line';


    const pointerMoveHandler = function (evt:any) {
      if (evt.dragging) {
        return;
      }

      let helpMsg = 'Click to start drawing';

      if (sketch) {
        const geom = sketch.getGeometry();
        if (geom instanceof Polygon) {
          helpMsg = continuePolygonMsg;
        } else if (geom instanceof LineString) {
          helpMsg = continueLineMsg;
        }
      }

      helpTooltipElement.innerHTML = helpMsg;
      helpTooltip.setPosition(evt.coordinate);

      helpTooltipElement.classList.remove('hidden');
    };

    const map = new Map({
      layers: [raster, vector],
      target: mapContainer,
      view: new View({
        center: [-11000000, 4600000],
        zoom: 15,
      }),
    });

    map.on('pointermove', pointerMoveHandler);

    map.getViewport().addEventListener('mouseout', function () {
      helpTooltipElement.classList.add('hidden');
    });

    const typeSelect = document.getElementById('type');

    let draw:any; // global so we can remove it later


    const formatLength = function (line:any) {
      const length = getLength(line);
      let output;
      if (length > 1000) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
      }
      return output;
    };

    const formatArea = function (polygon:any) {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
      }
      return output;
    };

    function addInteraction() {
      const typeSelect = document.getElementById('type') as HTMLSelectElement;
      const type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
      draw = new Draw({
        source: source,
        type: type,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)',
            }),
          }),
        }),
      });
      map.addInteraction(draw);

      createMeasureTooltip();
      createHelpTooltip();

      let listener:any;
      draw.on('drawstart', function (evt:any) {
        // set sketch
        sketch = evt.feature;


        let tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt:any) {
          const geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          measureTooltipElement.innerHTML = output;
          measureTooltip.setPosition(tooltipCoord);
        });
      });

      draw.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        unByKey(listener);
      });
    }


    function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
      helpTooltipElement = document.createElement('div');
      helpTooltipElement.className = 'ol-tooltip hidden';
      helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
      });
      map.addOverlay(helpTooltip);
    }


    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement('div');
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false,
      });
      map.addOverlay(measureTooltip);
    }

    if (typeSelect) {
      typeSelect.onchange = function () {
        map.removeInteraction(draw);
        addInteraction();
      };
    }

    addInteraction();

    return () => {
      map.setTarget(null!);
    };

  }, []);

  return (
    <>
      {typeof window !== "undefined" && (
        <div id="map" className="openmap"></div>
      )}
      <form className="form">
        <label htmlFor="type">측정 타입 &nbsp;</label>
        <select id="type">
          <option value="length">선 (LineString)</option>
          <option value="area">면적 (Polygon)</option>
        </select>
      </form>
    </>
  )
};

export default MeasureMap;
