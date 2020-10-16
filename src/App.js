import React, { useRef, useEffect, useState, useCallback } from "react";
import "./App.css";
import SvgComponent from "./SvgComponent";
import DatGui, { DatNumber, DatSelect } from "@tim-soft/react-dat-gui";

function App() {
  const mainGroup = useRef();

  const [data, setData] = useState({
    tx: 0,
    ty: 0,
    cx: 0,
    cy: 0,
    scale: 1,
    zoomToId: null,
  });
  const [bboxes, setBboxes] = useState([]);
  useEffect(() => {
    const bboxes = Array.prototype.slice
      .call(mainGroup.current.querySelectorAll("#prefix__Regions path"))
      .map((el) => ({
        id: el.id,
        bbox: el.getBBox(),
      }));
    setBboxes(bboxes);
  }, []);

  const onUpdate = useCallback(
    (newData) => {
      if (data.zoomToId !== newData.zoomToId) {
        if (!bboxes.length) return;

        if (newData.zoomToId === " --- ") {
          newData.tx = 0;
          newData.ty = 0;
          newData.cx = 0;
          newData.cy = 0;
          newData.scale = 1;
        } else {
          const bbox = bboxes.find(({ id }) => id === newData.zoomToId);
          newData.tx = -bbox.bbox.x + 1730.9 / 2 - bbox.bbox.width / 2;
          newData.ty = -bbox.bbox.y + 1272.6 / 2 - bbox.bbox.height / 2;

          newData.cx = bbox.bbox.x + bbox.bbox.width / 2;
          newData.cy = bbox.bbox.y + bbox.bbox.height / 2;
          newData.scale = 7;
        }
      }

      setData((state) => ({
        ...state,
        ...newData,
      }));
    },
    [data, bboxes]
  );

  return (
    <>
      <DatGui
        data={data}
        onUpdate={onUpdate}
        className="react-dat-gui-relative-position"
      >
        <DatNumber path="tx" label="tx" min={-1000} max={1000} step={1} />
        <DatNumber path="ty" label="ty" min={-1000} max={1000} step={1} />
        <DatNumber path="scale" label="scale" min={0.001} max={15} step={1} />
        <DatSelect
          label="Zoom to"
          path="zoomToId"
          options={[" --- "].concat(bboxes.map((box) => box.id))}
        />
      </DatGui>
      <SvgComponent
        tx={data.tx}
        ty={data.ty}
        cx={data.cx}
        cy={data.cy}
        scale={data.scale}
        ref={mainGroup}
      />
    </>
  );
}

export default App;
