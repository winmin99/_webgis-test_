
const MakeCircle =(kakaoMap:any) => {
  var markerPosition = new window.kakao.maps.LatLng(
    36.80561042120899,
    128.6239256437062
  )

  const circle = new window.kakao.maps.Circle({
    center: markerPosition,
    radius: 50,
    strokeWeight: 3,
    strokeColor: '#ffa409',
    strokeOpacity: 1,
    strokeStyle: "solid",
    fillColor: "#ffa409",
    fillOpacity: 0.5,
  });
  circle.setMap(kakaoMap); //지도위에 원을 생성
}

export default MakeCircle;

