import styled from "@emotion/styled";
import {
  SearchOutlined,
  CaretLeftFilled,
  CaretRightFilled,
} from "@ant-design/icons";

interface ISearchBarOpen {
  isOpen: boolean;
}

export const MapSection = styled.div`
  display: flex;
  .olmap {
    display: flex;
    width: 100vw;
    height: calc(100vh - 55px);
    position: absolute;
    top: 55px;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
  }
  .ol-zoom {
    display: none;
  }
  .ol-rotate {
    display: none;
  }
  .kakaoMap {
    display: flex;
    width: 100vw;
    height: calc(100vh - 55px);
    position: absolute;
    top: 55px;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
  }

  #menuDiv {
    display: flex;
    position: relative;
    z-index: 2;
    font-size: 12px;
  }

  #menu_wrap {
    margin-top: 30px;
    position: relative;
    width: 400px;
    height: 600px;
    border-radius: 20px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.7);
    display: ${(props: ISearchBarOpen) => (props.isOpen ? "" : "none")};
  }

  #map_title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px;
  }

  #form {
    display: flex;
    justify-content: space-between;
    padding: 0px 15px 10px 15px;
  }

  #keyword {
    width: 100%;
    border: none;
    outline: none;
  }

  #submit_btn {
    background-color: #ff6e30;
    border: none;
    outline: none;
  }

  #placesList h5 {
    color: #ff6e30;
  }

  #placesList li {
    list-style: square;
  }

  #placesList .item {
    border-bottom: 1px solid #888;
    overflow: hidden;
    cursor: pointer;
  }

  #placesList .item .info {
    padding: 10px 0 10px 5px;
  }

  #placesList .item span {
    display: block;
    margin-top: 4px;
  }

  #placesList .info .gray {
    color: #8a8a8a;
  }

  #placesList .info .tel {
    color: #009900;
  }

  #btnDiv {
    display: flex;    
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  #pagination {
    margin: 10px auto;
    text-align: center;
  }

  #pagination a {
    display: inline-block;
    margin-right: 10px;
    color: #7b7b7b;
  }

  #pagination .on {
    font-weight: bold;
    cursor: default;
    color: #ff6e30;
  }

  #btnOn {
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  #searchBtn {
    width: 20px;
    padding: 0px;
    height: 70px;
    background-color: #ffa230;
    border: none;
    outline: none;
  }

`;

export const SearchIcon = styled(SearchOutlined)`
  color: black;
  cursor: pointer;
`;

export const LeftDisplayButton = styled(CaretLeftFilled)`
  color: #fff;
  cursor: pointer;
`;
export const RightDisplayButton = styled(CaretRightFilled)`
  color: #fff;
  cursor: pointer;
`;
