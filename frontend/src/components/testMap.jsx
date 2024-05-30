import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Text } from 'react-konva';
import LabelForm from './testC';

const BuildingEditor = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [labels, setLabels] = useState([]);
  const [newLabelPos, setNewLabelPos] = useState(null);
  const [isLabelFormVisible, setIsLabelFormVisible] = useState(false);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCancel = () => {
    setCurrentLine([]);
    setIsLabelFormVisible(false);
  };

  const handleStageMouseDown = (e) => {
    if (!drawingEnabled || isLabelFormVisible) return;
    
    const { x, y } = e.target.getStage().getPointerPosition();
    setIsDrawing(true);

    if (currentLine.length === 0) {
      setCurrentLine([{ x, y }]);
    } else {
      const lastPoint = currentLine[currentLine.length - 1];
      const firstPoint = currentLine[0];
      const distanceToFirst = Math.sqrt((firstPoint.x - x) ** 2 + (firstPoint.y - y) ** 2);

      if (distanceToFirst < 10 && currentLine.length > 2) {
        setLines([...lines, [...currentLine, firstPoint]]);
        setCurrentLine([]);
      } else {
        setCurrentLine([...currentLine, { x, y }]);
      }
    }
  };

  const handleStageMouseMove = (e) => {
    if (!isDrawing || currentLine.length === 0) return;

    const { x, y } = e.target.getStage().getPointerPosition();
    const newLine = [...currentLine.slice(0, -1), { x, y }];
    setCurrentLine(newLine);
  };

  const handleStageMouseUp = () => {
    setIsDrawing(false);
  };

  const handleDoubleClick = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setNewLabelPos({ x, y });
    setIsLabelFormVisible(true);
  };

  const handleAddLabel = (text) => {
    setLabels([...labels, { ...newLabelPos, text }]);
    setNewLabelPos(null);
    setIsLabelFormVisible(false);
  };

  const toggleDrawing = () => {
    setDrawingEnabled(!drawingEnabled);
  };

  return (
    <div>
      <button onClick={toggleDrawing}>
        {drawingEnabled ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onDblClick={handleDoubleClick}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              <Line
                points={line.flatMap(point => [point.x, point.y])}
                stroke="black"
                strokeWidth={2}
                closed
              />
              {line.map((point, j) => (
                <Circle key={j} x={point.x} y={point.y} radius={5} fill="black" />
              ))}
            </React.Fragment>
          ))}
          {currentLine.length > 0 && (
            <React.Fragment>
              <Line
                points={currentLine.flatMap(point => [point.x, point.y])}
                stroke="red"
                strokeWidth={2}
              />
              {currentLine.map((point, i) => (
                <Circle key={i} x={point.x} y={point.y} radius={5} fill="red" />
              ))}
            </React.Fragment>
          )}
          {labels.map((label, i) => (
            <Text
              key={i}
              x={label.x}
              y={label.y}
              text={label.text}
              fontSize={16}
              fill="black"
              onClick={() => alert(label.text)}
            />
          ))}
        </Layer>
      </Stage>
      {isLabelFormVisible && (
        <LabelForm onSubmit={handleAddLabel} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default BuildingEditor;