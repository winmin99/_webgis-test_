import {toLonLat} from "ol/proj";
import {ObjectEvent} from "ol/Object";

let currentZoom: number | undefined
function onChangeCenter(e:ObjectEvent,kakaoMap:any,view:any){
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
}

export {onChangeCenter}