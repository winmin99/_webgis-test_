import React from "react";
import {Map, View} from "ol";
import {YeongjuPosition} from "../../common/position";
import {FaHome, FaPlus} from "react-icons/fa";
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import "./MapInteraction.scss";
import {fromLonLat} from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Geometry} from "ol/geom";

interface Props {
  children?: JSX.Element | JSX.Element[];
}

interface SubProps2 {
  map?: Map;
  position?: number[];
}
interface SubProps3
{
  map?: Map,
  drawend?: (e: DrawEvent) => void
}
export default function MapInteraction({children}: Props): JSX.Element
{
  return(
    <div
      className="map-interaction">
      {children}
    </div>
  )
}

//홈버튼 추가
export function HomeButton({
                             map,
                             position = YeongjuPosition,
                           }: SubProps2): JSX.Element | null {
  const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187");
  // 맵 객체가 유효할 경우
  if (map) {
    const onClick = () => {
      flyTo(map.getView(), epsg5187Coord);
    };

    return (
      <button className="sejong" title="영주시 이동" onClick={onClick}>
        <FaHome color="white" size={25}/>
      </button>
    );
  }

  // 아닐 경우

  return null;
}

export function AddPolygon({ map, drawend }: SubProps3): JSX.Element | null
{
  // 맵 객체가 유효할 경우
  if (map)
  {
    let drawLayer = map.getAllLayers().filter((layer) => layer.get('name') === 'draw')[0];

    // 드로우 벡터 레이어가 없을 경우
    if (!drawLayer)
    {
      const drawSource = new VectorSource();

      drawLayer = new VectorLayer({
        properties: { name: 'draw' },
        source: drawSource
      });

      map.addLayer(drawLayer);
    }

    const drawInteraction = new Draw({
      source: drawLayer.getSource() as VectorSource<Geometry>,
      type: 'Polygon'
    });

    document.onkeyup = (e) =>
    {
      // ESC를 눌렀을 경우
      if (e.key.toLowerCase() === 'escape')
      {
        map.removeInteraction(drawInteraction);
      }
    };

    document.oncontextmenu = () =>
    {
      map.removeInteraction(drawInteraction);
    };

    const onClick = () =>
    {
      drawInteraction.once('drawstart', () =>
      {
        const source = drawLayer.getSource() as VectorSource<Geometry> | undefined;
        if (source) {
          source.clear();
        }
      });

      // 드로우 종료 메서드가 있을 경우
      if (drawend)
      {
        drawInteraction.once('drawend', (e) =>
        {
          map.removeInteraction(drawInteraction);
          drawend(e);
        });
      }

      map.addInteraction(drawInteraction);
    };

    return (
      <button className='add' title='건물 추가' onClick={onClick}><FaPlus color='white' size={20} /></button>
    );
  }

  // 아닐 경우

  return null;
}

function flyTo(view: View, location: number[]): void {
  const duration = 2000;
  const zoom = view.getZoom() || 15;

  let parts = 2;
  let called = false;

  const callback = (complete: boolean) => {
    --parts;

    // 동작이 끝났을 경우
    if (called) {
      console.dir(2);
      return;
    }

    // 동작한 경우
    if (parts === 0 || !complete) {
      called = true;
    }
  };

  view.animate(
    {
      center: location,
      duration,
    },
    callback
  );

  view.animate(
    {
      duration: duration / 2,
      zoom: zoom - 3,
    },
    {
      duration: duration / 2,
      zoom,
    },

    callback
  );
}
