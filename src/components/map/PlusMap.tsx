import React,{useEffect, useRef} from "react";
import "./PlusMap.scss"

interface CustomWindow extends Window {
  kakao: any;
}

type MapTypes = {
  terrain: any;
  traffic: any;
  bicycle: any;
  useDistrict: any;
  [key: string]: any;
};

const PlusMap = (props: any): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null)
  const kakaoMap = useRef<CustomWindow["kakao"]["maps"]["Map"] | null>(null); // Ref for kakaoMap
  const currentTypeId = useRef<number | null>(null); // Ref for currentTypeId

  //지도 바꾸기2 예제
  const mapTypes: MapTypes = {
    terrain: window.kakao.maps.MapTypeId.TERRAIN,
    traffic: window.kakao.maps.MapTypeId.TRAFFIC,
    bicycle: window.kakao.maps.MapTypeId.BICYCLE,
    useDistrict: window.kakao.maps.MapTypeId.USE_DISTRICT,
    roadview : window.kakao.maps.MapTypeId.ROADVIEW,
  };

  const setOverlayCheckMapTypeId = () => {
    const chkTerrain = document.getElementById("chkTerrain") as HTMLInputElement;
    const chkTraffic = document.getElementById("chkTraffic") as HTMLInputElement;
    const chkBicycle = document.getElementById("chkBicycle") as HTMLInputElement;
    const chkUseDistrict = document.getElementById("chkUseDistrict") as HTMLInputElement;
    const chkROADVIEW = document.getElementById("chkROADVIEW")as HTMLInputElement

    // 지도 타입을 제거합니다
    for (const type in mapTypes) {
      if (mapTypes.hasOwnProperty(type)) { // 오류 해결을 위해 hasOwnProperty를 사용하여 속성 유무를 체크
        kakaoMap.current.removeOverlayMapTypeId(mapTypes[type] as any); // 타입 단언
      }
    }

    // 지적편집도정보 체크박스가 체크되어있으면 지도에 지적편집도정보 지도타입을 추가합니다
    if (chkUseDistrict.checked) {
      kakaoMap.current.addOverlayMapTypeId(mapTypes.useDistrict);
    }

    // 지형정보 체크박스가 체크되어있으면 지도에 지형정보 지도타입을 추가합니다
    if (chkTerrain.checked) {
      kakaoMap.current.addOverlayMapTypeId(mapTypes.terrain);
    }

    // 교통정보 체크박스가 체크되어있으면 지도에 교통정보 지도타입을 추가합니다
    if (chkTraffic.checked) {
      kakaoMap.current.addOverlayMapTypeId(mapTypes.traffic);
    }

    // 자전거도로정보 체크박스가 체크되어있으면 지도에 자전거도로정보 지도타입을 추가합니다
    if (chkBicycle.checked) {
      kakaoMap.current.addOverlayMapTypeId(mapTypes.bicycle);
    }

    if (chkROADVIEW.checked) {
      kakaoMap.current.addOverlayMapTypeId(mapTypes.roadview);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakao) {
      // SDK 스크립트가 로드된 후에 window 객체와 window.kakao 객체가 존재하는 경우에만 실행되는 코드
      // 카카오 지도 API 로드가 완료된 후에 실행되는 코드
      if(mapRef.current){ // 지도를 표시할 div element
        const options = {
          center: new window.kakao.maps.LatLng(36.80561042120899, 128.6239256437062), // 지도의 중심좌표
          level: 2, // 지도의 확대 레벨
        };
        kakaoMap.current = new window.kakao.maps.Map(mapRef.current, options); // 지도 생성

        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        kakaoMap.current.addControl(
          mapTypeControl,
          window.kakao.maps.ControlPosition.TOPRIGHT
        );

        const markerPosition = new window.kakao.maps.LatLng(
          36.80561042120899,
          128.6239256437062
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(kakaoMap.current);

        const iwContent = '<div style="padding-left:40px; font-weight: bold; text-align: center;"  >영주시청2</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwPosition = new window.kakao.maps.LatLng(36.805679, 128.624043), //인포윈도우 표시 위치입니다
          iwRemoveable = false; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

        // 인포윈도우를 생성합니다
        const infowindow = new window.kakao.maps.InfoWindow({
          position: iwPosition,
          content: iwContent,
          removable: iwRemoveable
        });
        infowindow.open(kakaoMap.current, marker);

        const circle = new window.kakao.maps.Circle({
          center: options.center, // 지도의 �����������
          radius: 50,
          strokeWeight: 5,
          strokeColor: '#ffa409',
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: "#ffa409",
          fillOpacity: 0.5,
        });
        circle.setMap(kakaoMap.current); //지도위에 원을 생성
      }
    }
  }, []);
  return (
    <>
      <div ref= {mapRef} className="plusmap">
        <div className="checkbox">
          <input type="checkbox" id="chkUseDistrict" onClick={() => setOverlayCheckMapTypeId()}/> 지적편집도 정보 보기
          <input type="checkbox" id="chkTerrain" onClick={() => setOverlayCheckMapTypeId()}/> 지형정보 보기
          <input type="checkbox" id="chkTraffic" onClick={() => setOverlayCheckMapTypeId()}/> 교통정보 보기
          <input type="checkbox" id="chkBicycle" onClick={() => setOverlayCheckMapTypeId()}/> 자전거도로 정보 보기
          <input type="checkbox" id="chkROADVIEW" onClick={() => setOverlayCheckMapTypeId()}/> 로드뷰도로 정보 보기
        </div>
      </div>
    </>
  );
}
export default PlusMap;
