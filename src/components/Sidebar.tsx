import React, {useEffect, useRef, useState} from "react";
import classes from "./Sidebar.module.css";
import logoimg from "../assets/img.png"
import {BsBuildingsFill, BsFillFolderFill, BsFillGrid3X3GapFill, BsHouseDoorFill, BsTreeFill} from "react-icons/bs";

interface SidebarProps {
  width?: number;
  children?: React.ReactNode;
}

const Sidebar = ({width = 280, children}:SidebarProps):JSX.Element => {
  //페이지 리로드 함수
  const handleTitleClick = () => {
    window.location.reload();
  }
  const [isOpen, setOpen] = useState<boolean>(false);//사이드바 열렸을때 닫혔을때 상태지정
  const [xPosition, setX] = useState<number>(width);
  const side = useRef<HTMLDivElement>(null);//side 변수에 할당되며 구성 요소 코드에서 사이드바를 나타내는 DOM 요소를 참조하는 데 사용됩니다.

  // button 클릭 시 토글 xPosition이 > 0 면 사이드바가 닫혔으니 setx = 0 이고 setOpen은 "true"
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setOpen(true);
    } else {
      setX(width);
      setOpen(false);
    }
  };

  // 사이드바 외부 클릭시 닫히는 함수
  const handleClose = async (e: MouseEvent) => {
    if (isOpen && side.current && !side.current.contains(e.target as Node)) {
      await setX(width);
      await setOpen(false);
    }
  };

  //handleClose 함수를 트리거하는 클릭 이벤트에 대한 이벤트 리스너를 창에 추가하는 데 사용됩니다.
  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, []);

  return (
    <div className={classes.container}>
      {isOpen && <div className={classes.backdrop} onClick={() => toggleMenu()}></div>} {/* Add backdrop */}
      <div
        ref={side}
        className={classes.sidebar}
        style={{width: `${width}px`, height: "100%", transform: `translatex(${-xPosition}px)`}}
      >
        <button onClick={() => toggleMenu()} className={classes.button}>
          {isOpen ? <span>X</span> : <img src={logoimg} alt="contact open button" className={classes.openBtn}/>}
        </button>
        <div className={classes.div}>
          <BsHouseDoorFill className={classes.icon} size="18" color="black"/>
          <h1 onClick={handleTitleClick}>영주시 상수 웹조회시스템</h1>
        </div>
        <div className={classes.content}>
          <ul>
            <BsFillFolderFill/>
            <li>수치지형도</li>
            <br/>
            <div>
              <BsBuildingsFill className={classes.icon}/>
              <span className={classes.content}>건물 및 도로</span>
            </div>
            <li>상수 관로</li>
            <br/>
            <div>
              <BsTreeFill className={classes.icon}/>
              <span className={classes.content}>표고점</span>
            </div>
            <li>상수 시설</li>
            <br/>
            <div>
              <BsFillGrid3X3GapFill className={classes.icon}/>
              <span className={classes.content}>지적선 및 지번</span>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
