import {defaults as defaultInteractions, DoubleClickZoom, Draw, MouseWheelZoom, Select} from 'ol/interaction';

//Openlayers 지도와 상호작용 하는 옵션
export default defaultInteractions({
  altShiftDragRotate: false,
  onFocusOnly: true,
  doubleClickZoom: false,
  keyboard: false,
  shiftDragZoom: false,
  pinchRotate: false,
  pinchZoom: false,
  dragPan: true,
  zoomDelta: 1,
  zoomDuration: 0,
}).extend([
  new MouseWheelZoom({
    constrainResolution: true,
    maxDelta: 1, // 줌값을 1씩 변경되게하는 옵션
    duration: 0, // 줌이동 애니메이션을 설정하는 옶션 0으로 만들어놓아야함
    // useAnchor: true 고정, Enable zooming using the mouse's location as the anchor
    useAnchor: true,
  }),
]);