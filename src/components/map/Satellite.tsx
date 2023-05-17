import React, {useEffect, useRef} from 'react';
import classes from "./Satellite.module.css";
import MakeCircle from "../../common/MakeCircle";

declare global {
  interface Window {
    kakao: any;
  }
}
//위성지도 컴포넌트
const Satellite = (): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null)
  const kakaoMap = useRef<any>(null)
  useEffect(() => {
    document.querySelector("#kakaomap > div")?.remove();
    if(mapRef.current){
      const options = {
        center: new window.kakao.maps.LatLng(36.80561042120899,
          128.6239256437062),
        level: 3,
      };
      kakaoMap.current = new window.kakao.maps.Map(mapRef.current, options);

      kakaoMap.current.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID)

      const markerPosition = new window.kakao.maps.LatLng(
        36.80561042120899,
        128.6239256437062
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(kakaoMap.current);

      const iwContent = '<div style="padding-left:40px; font-weight: bold; text-align: center;"  >영주시청</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new window.kakao.maps.LatLng(36.805679, 128.624043), //인포윈도우 표시 위치입니다
        iwRemoveable = false; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      // 인포윈도우를 생성합니다
      const infowindow = new window.kakao.maps.InfoWindow({
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable
      });
      infowindow.open(kakaoMap.current, marker);

      MakeCircle(kakaoMap.current)
    }
  }, [])
  return (
    <>
      <div ref= {mapRef} className={classes.satellitemap}></div>
    </>
  )
}

export default Satellite