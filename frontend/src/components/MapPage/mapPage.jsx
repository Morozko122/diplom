// import React, { useState, useRef } from 'react';
// import { Stage, Layer, Image, Ellipse, Text } from 'react-konva';
// import useImage from 'use-image';

// const AnnotatedImage = ({ src }) => {
//   const [image] = useImage(src);
//   const [annotations, setAnnotations] = useState([]);
//   const [text, setText] = useState('');
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const stageRef = useRef(null);

//   const handleStageClick = (e) => {
//     const stage = stageRef.current;
//     const pointerPosition = stage.getPointerPosition();
//     const mousePointTo = {
//       x: (pointerPosition.x - stage.x()) / stage.scaleX(),
//       y: (pointerPosition.y - stage.y()) / stage.scaleY()
//     };
//     setAnnotations([
//       ...annotations,
//       {
//         x: mousePointTo.x,
//         y: mousePointTo.y,
//         text: text
//       }
//     ]);
//     setText('');
//   };

//   const handleWheel = (e) => {
//     e.evt.preventDefault();
//     const scaleBy = 1.1;
//     const stage = stageRef.current;
//     const oldScale = stage.scaleX();
//     const pointer = stage.getPointerPosition();

//     const mousePointTo = {
//       x: (pointer.x - stage.x()) / oldScale,
//       y: (pointer.y - stage.y()) / oldScale
//     };

//     const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
//     setScale(newScale);
//     setPosition({
//       x: pointer.x - mousePointTo.x * newScale,
//       y: pointer.y - mousePointTo.y * newScale
//     });
//   };

//   const handleSave = () => {
//     const uri = stageRef.current.toDataURL();
//     const link = document.createElement('a');
//     link.download = 'annotated-image.png';
//     link.href = uri;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleDeleteAnnotation = (index) => {
//     const newAnnotations = annotations.filter((_, i) => i !== index);
//     setAnnotations(newAnnotations);
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
//         <button onClick={() => alert('Создать метку')}>Создать метку</button>
//         <button onClick={() => alert('Редактировать')}>Редактировать</button>
//         <ul>
//           {annotations.map((annotation, index) => (
//             <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
//               {annotation.text}
//               <button onClick={() => handleDeleteAnnotation(index)} style={{ marginLeft: '5px' }}>✖</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div style={{ flex: 1 }}>
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Enter text"
//           style={{ marginBottom: '10px' }}
//         />
//         <button onClick={handleSave}>Save Image</button>
//         <Stage
//           width={window.innerWidth - 200}
//           height={window.innerHeight}
//           scaleX={scale}
//           scaleY={scale}
//           x={position.x}
//           y={position.y}
//           ref={stageRef}
//           onWheel={handleWheel}
//           draggable
//           onClick={handleStageClick}
//         >
//           <Layer>
//             <Image image={image} x={0} y={0} />
//             {annotations.map((annotation, index) => (
//               <React.Fragment key={index}>
//                 <Ellipse
//                   x={annotation.x}
//                   y={annotation.y}
//                   radiusX={50}
//                   radiusY={25}
//                   stroke="red"
//                   strokeWidth={4 / scale}
//                 />
//                 <Text
//                   x={annotation.x - 10}
//                   y={annotation.y - 10}
//                   text={annotation.text}
//                   fontSize={20}
//                   fill="white"
//                 />
//               </React.Fragment>
//             ))}
//           </Layer>
//         </Stage>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const [imageUrl, setImageUrl] = useState('');

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setImageUrl(event.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div>
//       {imageUrl ? (
//         <AnnotatedImage src={imageUrl} />
//       ) : (
//         <div
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           style={{
//             width: '100%',
//             height: '100vh',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             border: '2px dashed #ccc'
//           }}
//         >
//           Drag & Drop Image Here
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Ellipse, Text } from 'react-konva';
import useImage from 'use-image';

const AnnotatedImage = ({ src, onDeleteLabel, labels }) => {
  const [image] = useImage(src);
  const [annotations, setAnnotations] = useState(labels || []);
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
        width={window.innerWidth * 0.7}
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
  const [imageUrl, setImageUrl] = useState('');
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddLabel = () => {
    setLabels([...labels, { text: newLabel }]);
    setNewLabel('');
  };

  const handleDeleteLabel = (index) => {
    const updatedLabels = labels.filter((_, i) => i !== index);
    setLabels(updatedLabels);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {imageUrl ? (
          <AnnotatedImage src={imageUrl} labels={labels} onDeleteLabel={handleDeleteLabel} />
        ) : (
          <div style={{ border: '2px dashed #ccc', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input type="file" onChange={handleFileChange} />
            <p>Переместите изображение чтобы начать</p>
          </div>
        )}
      </div>
      <div style={{ width: '300px', padding: '10px', borderLeft: '1px solid #ccc' }}>
        <button onClick={handleAddLabel}>Создать метку</button>
        <button>Редактирование</button>
        <ul>
          {labels.map((label, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{label.text}</span>
              <button onClick={() => handleDeleteLabel(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
