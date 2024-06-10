import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Ellipse, Text } from 'react-konva';
import useImage from 'use-image';

const AnnotatedImage = ({ src }) => {
  const [image] = useImage(src);
  const [annotations, setAnnotations] = useState([]);
  const [text, setText] = useState('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const handleStageClick = (e) => {
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY()
    };
    setAnnotations([
      ...annotations,
      {
        x: mousePointTo.x,
        y: mousePointTo.y,
        text: text
      }
    ]);
    setText('');
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    });
  };

  const handleSave = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'annotated-image.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
      />
      <button onClick={handleSave}>Save Image</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        ref={stageRef}
        onWheel={handleWheel}
        draggable
        onClick={handleStageClick}
      >
        <Layer>
          <Image image={image} x={0} y={0} />
          {annotations.map((annotation, index) => (
            <React.Fragment key={index}>
              <Ellipse
                x={annotation.x}
                y={annotation.y}
                radiusX={50}
                radiusY={25}
                stroke="red"
                strokeWidth={4 / scale}
              />
              <Text
                x={annotation.x - 10}
                y={annotation.y - 10}
                text={annotation.text}
                fontSize={20}
                fill="white"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

const App = () => {
  const imageUrl = 'https://ock-ola.mag.muzkult.ru/media/2018/08/11/1227224835/image_image_3599394.png'; // Replace with your image URL

  return (
    <div>
      <AnnotatedImage src={imageUrl} />
    </div>
  );
};

export default App;
