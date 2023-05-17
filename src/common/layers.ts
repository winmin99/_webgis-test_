import {Vector as VectorLayer} from "ol/layer";
import {Vector as VectorSource} from "ol/source";
import {GeoJSON} from "ol/format";
import {Stroke, Style} from "ol/style";

const layers = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: "http://djgis.iptime.org:8000/geoserver/yeongju_a/wfs?typename=yeongju_a%3Aviw_wtl_pipe_lm&service=WFS&version=2.0.0&request=GetFeature&outputFormat=application%2Fjson&propertyName=geom"
  }),
  style: new Style({
    stroke: new Stroke({
      color: '#0033ff',
      width: 1.5
    })
  })
})

export default layers