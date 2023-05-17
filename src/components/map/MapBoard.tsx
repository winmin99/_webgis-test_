import { Map } from "ol";
import React,{ useEffect, useState } from "react";
import { FaRegCopy, FaRegWindowMinimize } from "react-icons/fa";
import { FiMaximize } from "react-icons/fi";

import "./MapBoard.scss";

interface Props {
  map?: Map;
}

export default function MapBoard({ map }: Props): JSX.Element | null {
  if (!map) {
    return null;
  }
  const [show, setShow] = useState(true);
  const [epsg, setEpsg] = useState("");
  map.once("postrender", () => {
    const zoom = map.getView().getZoom() || 0;
    const [minX, minY, maxX, maxY] = map.getView().calculateExtent();
    const [x, y] = [(minX + maxX) / 2, (minY + maxY) / 2];

    setZoom(zoom);
    setEpsg(map.getView().getProjection().getCode());
    setBoundary([minX, minY, maxX, maxY]);
    setPosition([x, y]);
  });

  map.on("postrender", () => setBoundary(map.getView().calculateExtent()));

  map.on("pointermove", (e) => setPosition(e.coordinate));

  map.on("moveend", () => {
    const zoom = map.getView().getZoom() || 0;

    setZoom(zoom);
  });

  return (
    <div className="map-board" data-show={show}>
      <div className="item" data-name="header">
        <button onClick={() => setShow(!show)}>
          {show ? <FaRegWindowMinimize /> : <FiMaximize />}
        </button>
      </div>
      <div className="item" data-name="meta">
        <div>
          <small>proj</small>
          <input name="proj" value={epsg} readOnly />
          <CopyButton />
        </div>

        <div>
          <small>zoom</small>
          <input name="zoom" readOnly />
          <CopyButton />
        </div>
      </div>

      <div className="item" data-name="boundary">
        <div>
          <small>minX</small>
          <input name="minX" value="0" readOnly />
          <CopyButton />
        </div>

        <div>
          <small>minY</small>
          <input name="minY" value="0" readOnly />
          <CopyButton />
        </div>

        <div>
          <small>maxX</small>
          <input name="maxX" value="0" readOnly />
          <CopyButton />
        </div>

        <div>
          <small>maxY</small>
          <input name="maxY" value="0" readOnly />
          <CopyButton />
        </div>
      </div>

      <div className="item" data-name="position">
        <div>
          <small>x</small>
          <input name="x" value="0" readOnly />
          <CopyButton />
        </div>

        <div>
          <small>y</small>
          <input name="y" value="0" readOnly />
          <CopyButton />
        </div>
      </div>
    </div>
  );
}
function CopyButton(): JSX.Element {
  return (
    <button
      onClick={(e) => {
        const div = e.currentTarget.parentElement as HTMLElement;
        const input = div.querySelector("input") as HTMLInputElement;
        input.select();

        document.execCommand("Copy");
      }}
    >
      <FaRegCopy />
    </button>
  );
}
function setZoom(level: number): void {
  const meta = document.querySelector(".map-board > [data-name=meta]");

  // 메타 태그가 유효할 경우
  if (meta) {
    const tag = meta.querySelector("input[name=zoom]") as HTMLInputElement;
    tag.value = level.toString();
  }
}
function setBoundary(pos: number[]): void {
  const boundary = document.querySelector(".map-board > [data-name=boundary]");

  // 영역 보드 태그가 유효할 경우
  if (boundary) {
    const tag1 = boundary.querySelector("input[name=minX]") as HTMLInputElement;
    const tag2 = boundary.querySelector("input[name=minY]") as HTMLInputElement;
    const tag3 = boundary.querySelector("input[name=maxX]") as HTMLInputElement;
    const tag4 = boundary.querySelector("input[name=maxY]") as HTMLInputElement;

    const [minX, minY, maxX, maxY] = pos;

    tag1.value = minX.toString();
    tag2.value = minY.toString();
    tag3.value = maxX.toString();
    tag4.value = maxY.toString();
  }
}
function setPosition(pos: number[]): void {
  const position = document.querySelector(".map-board > [data-name=position]");

  // 위치 보드 태그가 유효할 경우
  if (position) {
    const tag1 = position.querySelector("input[name=x]") as HTMLInputElement;
    const tag2 = position.querySelector("input[name=y]") as HTMLInputElement;

    const [x, y] = pos;

    tag1.value = x.toString();
    tag2.value = y.toString();
  }
}
