import React, {useEffect, useRef, useState} from "react";
import {default as defaultInteractions} from "../../common/interaction"
import {default as epsg5187} from "../../common/projection"
import {Map} from "ol";
import {propsType} from "../MainHeader";
import AddMarker from "../../common/AddMarker";
import classes from "./MainMap.module.css";
import MakeCircle from "../../common/MakeCircle";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import {YeongjuPosition} from "../../common/position";
import * as S from "../../components/map/KakaoSearch.styled";
import layers from "../../common/layers";
import {ObjectEvent} from "ol/Object";
import {onChangeCenter} from "../../common/olView";
import Terrain from "./Terrain";
import Satellite2 from "./Satellite2";


declare global {
  interface Window {
    kakao: any;
  }
}

interface placeType {
  place_name: string,
  road_address_name: string,
  address_name: string,
  phone: string,
  place_url: string
}

const MainMap = (props: propsType): JSX.Element => {
  const epsg5187Coord = fromLonLat(YeongjuPosition, "EPSG:5187");
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMap = useRef<any>(null);
  const [mapType, setMapType] = useState("roadmap");

  const handleChangeMapType = (mapType: string) => {
    if (kakaoMap.current) {
      if (mapType === "roadmap") {
        kakaoMap.current.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
      } else if (mapType === "skyview") {
        kakaoMap.current.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
      }
    }
  };

  const handleTerrainChange = (newMapType:string) => {
    setMapType(newMapType);
    if(kakaoMap.current) {
      if(newMapType === "roadmap") {
        kakaoMap.current.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);
      }else if (newMapType === "terrain"){
        kakaoMap.current.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN);
      }
    }
  }

  useEffect(() => {
    document.querySelector("#olMap > .ol-viewport")?.remove();
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
        rotation: -0.02307, //맵을 회전
      })
    });

    document.querySelector("#kakaomap > div")?.remove();
    let markers: any[] = []; //검색시에 마커들을 담는 array
    const container = document.getElementById("kakaoMap");
    const options = {
      center: new window.kakao.maps.LatLng(36.80561042120899,
        128.6239256437062),
      level: 3,
    };
    kakaoMap.current = new window.kakao.maps.Map(mapRef.current, options);
    //olMap에서 뷰값을 가져와서 센터값을 가져와서 카카오맵 센터 좌표를 따라 가게 만듬
    const view = olMap.getView();
    view.on("change:center", (e: ObjectEvent) => onChangeCenter(e, kakaoMap.current, view));

    const markerPosition = new window.kakao.maps.LatLng(
      36.80561042120899,
      128.6239256437062
    );
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(kakaoMap.current);
    //장소 검색 객체를 생성합니다.
    const ps = new window.kakao.maps.services.Places();

    const infowindow = new window.kakao.maps.InfoWindow({
      zIndex: 1
    });
    const searchForm = document.getElementById("submit_btn");
    searchForm?.addEventListener("click", function (e) {
      e.preventDefault();
      searchPlaces();
    });

    //키워드 검색을 요청하는 함수입니다.

    // searchPlaces();
    function searchPlaces() {
      const keyword = (
        document.getElementById("keyword") as HTMLInputElement
      ).value;

      if (!keyword.replace(/^\s+|\s+$/g, "")) {
        alert("검색어를 입력해주세요!");
        return false;
      }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다. 검색옵션을 넣어서 검색 범위 지정
      ps.keywordSearch(keyword, placesSearchCB, {
        location: options.center,
        sort: window.kakao.maps.services.SortBy.DISTANCE
      });
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        displayPlaces(data); //검색목록과 마커를 표출

        displayPagination(pagination); //페이지 번호 표출

        const bounds = new window.kakao.maps.LatLngBounds(
          new window.kakao.maps.LatLng(36.835452059385595, 128.5999860503909), // 좌측 상단 위도, 경도
          new window.kakao.maps.LatLng(36.785943255917495, 128.6519183258972) // 우측 하단 위도, 경도
        );
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // kakaoMap.setBounds(bounds);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
      }
    }

    function displayMarker(place: any) {
      const marker = new window.kakao.maps.Marker({
        kakaoMap,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      });
      //마커에 클릭이벤트를 등록
      window.kakao.maps.event.addListener(
        marker,
        "click",
        function (mouseEvent: any) {
          // props.setAddress(place);
          infowindow.setContent(`
              <span>
              ${place.place_name}
              </span>
              `);
          infowindow.open(kakaoMap.current, marker);
          const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
          kakaoMap.current.panTo(moveLatLon);
        }
      );
    }

    function displayPlaces(places: string | any[]) {
      const listEl = document.getElementById("placesList");
      const menuEl = document.getElementById("menu_wrap");
      const fragment = document.createDocumentFragment();
      const bounds = new window.kakao.maps.LatLngBounds();

      removeAllChildNods(listEl);
      removeMarker();
      for (let i = 0; i < places.length; i++) {
        const placePosition = new window.kakao.maps.LatLng(
          places[i].y,
          places[i].x
        );
        const olCoods:any = [places[i].x, places[i].y] //olmap은 경도 위도 순으로 좌표가 설정되므로 x,y 를 바꿈
        const KakaoCoords:any = fromLonLat(olCoods, "EPSG:5187"); // 위좌표를 EPSG:5187로 바꿈
        console.log("검색:", placePosition)
        console.log("검색좌표",KakaoCoords)
        const marker: any = AddMarker(kakaoMap.current, markers, placePosition, i);
        const itemEl = getListItem(i, places[i]);
        bounds.extend(placePosition);
        (function (marker, title) {
          window.kakao.maps.event.addListener(
            marker,
            "mouseover",
            function () {
              displayInfowindow(marker, title);
            }
          );

          window.kakao.maps.event.addListener(
            marker,
            "mouseout",
            function () {
              infowindow.close();
            }
          );

          itemEl.addEventListener("click", function (e) {
            displayInfowindow(marker, title);
            console.log("이벤트", e)

            console.log("이거",KakaoCoords)
            console.log("뭐고",placePosition)

              olMap.getView().setCenter(KakaoCoords); //바꾼좌표로 olmap중심좌표를 움직임
            // kakaoMap.current.panTo(placePosition);
          });
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
      }

      listEl?.appendChild(fragment);
      if (menuEl) {
        menuEl.scrollTop = 0;
      }

      // map.panTo(bounds);
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index: any, places: any) {
      const el = document.createElement("li");

      let itemStr =
        '<span class="markerbg marker_' +
        (index + 1) +
        '"></span>' +
        '<div class="info">' +
        "   <h5>" +
        places.place_name +
        "</h5>";

      if (places.road_address_name) {
        itemStr +=
          "    <span>" +
          places.road_address_name +
          "</span>" +
          '   <span class="jibun gray">' +
          `<img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png">
              </img>` +
          places.address_name +
          "</span>";
      } else {
        itemStr += "    <span>" + places.address_name + "</span>";
      }

      itemStr +=
        '  <span class="tel">' + places.phone + "</span>" + "</div>";

      el.innerHTML = itemStr;
      el.className = "item";

      return el;
    }

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다


    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    function removeMarker() {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }
    /*-----------------------------------------------*/

    /*---------------------------------------------- */

    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    function displayPagination(pagination: any) {
      const paginationEl = document.getElementById("pagination");
      const fragment = document.createDocumentFragment();
      while (paginationEl?.hasChildNodes()) {
        if (paginationEl.lastChild) {
          paginationEl.removeChild(paginationEl.lastChild);
        }
      }

      for (let i = 1; i <= pagination.last; i++) {
        const el = document.createElement("a");
        el.href = "#";
        el.innerHTML = String(i);

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl?.appendChild(fragment);
    }

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker: any, title: any) {
      const content =
        '<div style="padding:5px;z-index:1;">' + title + "</div>";

      infowindow.setContent(content);
      infowindow.open(kakaoMap.current, marker);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el: any) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    }

    MakeCircle(kakaoMap.current)
  }, []);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const onchangeSearch = (event: any) => {
    setSearch(event?.target.value);
  };

  const onClickSearchBarOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <S.MapSection className="map_wrap" isOpen={isOpen}>
        <div id="olMap" className={classes.olmap}></div>
        <div ref={mapRef} className={classes.kakaoMap}></div>
        <Terrain onChangeMapType={handleTerrainChange}/>
        <Satellite2 onChangeMapType={handleChangeMapType}/>
        <div id="menuDiv" style={{zIndex: 10}}>
          <div id="menu_wrap" className="bg_white">
            <div className="option">
              <div>
                <div id="map_title">
                  <div>주소 및 장소 검색</div>
                </div>

                <div id="form">
                  <input
                    type="image"
                    value={search}
                    id="keyword"
                    onChange={onchangeSearch}
                  />
                </div>
              </div>
            </div>

            <ul id="placesList"></ul>
            <div id="pagination"></div>
          </div>

          <div id="btnDiv">
            {isOpen ? (
              <div id="btnOn">
                <button
                  id="searchBtn"
                  onClick={onClickSearchBarOpen}
                  type="button"
                >
                  닫기
                  <S.LeftDisplayButton/>
                </button>
              </div>
            ) : (
              <div id="btnOn">
                <button
                  id="searchBtn"
                  onClick={onClickSearchBarOpen}
                  type="button"
                >
                  검색
                  <S.RightDisplayButton/>
                </button>
              </div>
            )}
          </div>
        </div>
      </S.MapSection>
    </>
  );
}
export default MainMap;
