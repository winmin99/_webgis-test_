import React, {useEffect, useState} from 'react';
import "./Roadview.scss"

declare global {
  interface Window {
    kakao: any;
  }
}

interface kakaoMap {
  kakaoMap : any
}

//로드뷰 컴포넌트
const TestRoadview = (kakaoMap:kakaoMap): JSX.Element => {
  useEffect(() => {
    var overlayOn = false;
    document.querySelector("#kakaomap > div")?.remove();
    const mapWrapper = document.getElementById("mapWrapper");//지도를 감싸고 있는 DIV태그
    // var container = document.getElementById("container");
    const mapcontainer = document.getElementById("kakaoMap"); //카카오맵을 표시할 div
    const options = {
      //중심점
      center: new window.kakao.maps.LatLng(36.80561042120899,
        128.6239256437062),
      level: 3, //줌레벨
    };
    kakaoMap.kakaoMap = new window.kakao.maps.Map(mapcontainer, options); //카카오맵 지도 구성
    kakaoMap.kakaoMap.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW)//지도 위에 로드뷰 도로 올리기
    // kakaoMap.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);

    const roadviewContainer = document.getElementById('roadview'); //로드뷰를 표시할 div
    const roadview = new window.kakao.maps.Roadview(roadviewContainer);//로드뷰 객체
    const roadviewClient = new window.kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
    const position = new window.kakao.maps.LatLng(36.80561042120899,
      128.6239256437062);
    toggleRoadview(options.center);

    //마커 이미지 생성
    const markImage = new window.kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
      new window.kakao.maps.Size(26, 46),
      {
        // 스프라이트 이미지를 사용합니다.
        // 스프라이트 이미지 전체의 크기를 지정하고
        spriteSize: new window.kakao.maps.Size(1666, 168),
        // 사용하고 싶은 영역의 좌상단 좌표를 입력합니다.
        // background-position으로 지정하는 값이며 부호는 반대입니다.
        spriteOrigin: new window.kakao.maps.Point(705, 114),
        offset: new window.kakao.maps.Point(13, 46)
      }
    );
    // 드래그가 가능한 마커를 생성합니다.
    const roadviewMarker = new window.kakao.maps.Marker({
      image: markImage,
      position: options.center,
      draggable: true,
      map: kakaoMap.kakaoMap,
    });
    //마커에 dragend 이벤트를 할당합니다
    window.kakao.maps.event.addListener(roadviewMarker, 'dragend', function (mouseEvent: any) {
      const position = roadviewMarker.getPosition(); //현재 마커가 놓인 자리의 좌표
      toggleRoadview(position); //로드뷰를 토글합니다
    });

    //지도에 클릭 이벤트를 할당합니다
    window.kakao.maps.event.addListener(kakaoMap, 'click', function (mouseEvent: any) {
      // 지도 위에 로드뷰 도로 오버레이가 추가된 상태가 아니면 클릭이벤트를 무시합니다

      // 현재 클릭한 부분의 좌표를 리턴
      const position = mouseEvent.latLng;

      roadviewMarker.setPosition(position);
      toggleRoadview(position); //로드뷰를 토글합니다
    });

    function toggleRoadview(position: number) {
      //전달받은 좌표(position)에 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄웁니다
      roadviewClient.getNearestPanoId(position, 50, function (panoId: string) {
        if (panoId === null) {
          if (roadviewContainer) {
            roadviewContainer.style.display = 'none'; //로드뷰를 넣은 컨테이너를 숨깁니다
          }
          if (mapWrapper) {
            mapWrapper.style.width = '100%';
            kakaoMap.kakaoMap.relayout();
          }
        } else {
          if (mapWrapper) {
            mapWrapper.style.width = '50%';
            kakaoMap.kakaoMap.relayout(); //지도를 감싸고 있는 영역이 변경됨에 따라, 지도를 재배열합니다
          }
          if (roadviewContainer) {
            roadviewContainer.style.display = 'block'; //로드뷰를 넣은 컨테이너를 보이게합니다
          }
          roadview.setPanoId(panoId, position); //panoId를 통한 로드뷰 실행
          roadview.relayout(); //로드뷰를 감싸고 있는 영역이 변경됨에 따라, 로드뷰를 재배열합니다
        }
      });
    }

    function toggleOverlay(active:any) {
      if (active) {
        overlayOn = true;

        // 지도 위에 로드뷰 도로 오버레이를 추가합니다
        kakaoMap.kakaoMap.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위에 마커를 표시합니다
        roadviewMarker.setMap(kakaoMap);

        // 마커의 위치를 지도 중심으로 설정합니다
        roadviewMarker.setPosition(kakaoMap.kakaoMap.getCenter());

        // 로드뷰의 위치를 지도 중심으로 설정합니다
        toggleRoadview(kakaoMap.kakaoMap.getCenter());
      } else {
        overlayOn = false;

        // 지도 위의 로드뷰 도로 오버레이를 제거합니다
        kakaoMap.kakaoMap.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위의 마커를 제거합니다
        roadviewMarker.setMap(null);
      }
    }

    function setRoadviewRoad() {
      var control = document.getElementById('roadviewControl');

      // 버튼이 눌린 상태가 아니면
      if (control && control.className && control.className.indexOf('active') === -1) {
        control.className = 'active';

        // 로드뷰 도로 오버레이가 보이게 합니다
        toggleOverlay(true);
      } else {
        control?.classList?.remove('active');

        // 로드뷰 도로 오버레이를 제거합니다
        toggleOverlay(false);
      }
    }

    //---------------------------------
  }, []);
  //클릭시 페이지 리로드 시키는 함수
  const handleTitleClick = () => {
    window.location.reload();
  }
  //기본지도위에 로드뷰를 50%로 올림
  return (
    <>
      <div id="mapWrapper">
        <div id="roadviewControl" className="roadviewControl"></div>
        <div id="kakaoMap" className="map"></div>
        <div id="roadview" className="roadview" ></div>
      </div>
    </>
  )
};

export default TestRoadview;