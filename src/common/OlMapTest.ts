import {Map, View} from "ol";
import {default as defaultInteractions} from "../common/interaction"
import {default as epsg5187} from "../common/projection"
import layers from "../common/layers";
import {YeongjuPosition} from "../common/position";
import {fromLonLat} from "ol/proj";

const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187");
const olMap = new Map({
  interactions: defaultInteractions,
  layers: [
    layers
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
    rotation: -0.02307, // rotate the map
  }),
});

export default olMap