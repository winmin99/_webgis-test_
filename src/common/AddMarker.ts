// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
const AddMarker = (map : any, markers : any ,position : any, idx : any, title? : any) => {
  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new window.kakao.maps.Size(36, 37),  // 마커 이미지의 크기
    imgOptions =  {
      spriteSize : new window.kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin : new window.kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new window.kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new window.kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker);  // 배열에 생성된 마커를 추가합니다

  return marker;
}

export default AddMarker;