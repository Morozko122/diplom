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
//             <div style={{ flex: 1 }}>
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
//       <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
//         <button onClick={() => alert('Создать метку')}>Создать метку</button>
//         <button onClick={() => alert('Редактировать')}>Редактировать</button>
//         <ul>
//           {annotations.map((annotation, index) => (
//             <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
//               <p>{annotation.text}</p>
//               <button onClick={() => handleDeleteAnnotation(index)} style={{ marginLeft: '5px' }}>✖</button>
//             </li>
//           ))}
//         </ul>
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
import { Stage, Layer, Image, Ellipse, Text} from 'react-konva';
import useImage from 'use-image';
import Modal from '@mui/joy/Modal';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import { Input } from '@mui/joy'; 

const AnnotatedImage = ({ src }) => {
  const [image] = useImage(src);
  const [annotations, setAnnotations] = useState([]);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const stageRef = useRef(null);

  const handleStageClick = (e) => {
    if (editIndex !== null) {
      setEditIndex(null);
      setText('');
      setDescription('');
      return;
    }

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
        text: text,
        description: description
      }
    ]);
    setText('');
    setDescription('');
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

  const handleDeleteAnnotation = (index) => {
    const newAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(newAnnotations);
  };

  const handleEditAnnotation = (index) => {
    setEditIndex(index);
    setText(annotations[index].text);
    setDescription(annotations[index].description);
    setModalIsOpen(true);
  };

  const handleAnnotationChange = (e) => {
    const { name, value } = e.target;
    if (name === 'text') {
      setText(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  const handleAnnotationSave = () => {
    if (editIndex !== null) {
      const updatedAnnotations = annotations.map((annotation, index) =>
        index === editIndex ? { ...annotation, text: text, description: description } : annotation
      );
      setAnnotations(updatedAnnotations);
      setEditIndex(null);
      setText('');
      setDescription('');
      setModalIsOpen(false);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditIndex(null);
    setText('');
    setDescription('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          name="text"
          value={text}
          onChange={handleAnnotationChange}
          placeholder="Enter text"
          style={{ marginBottom: '10px' }}
        />
        <input
          type="text"
          name="description"
          value={description}
          onChange={handleAnnotationChange}
          placeholder="Enter description"
          style={{ marginBottom: '10px' }}
        />
        <button onClick={editIndex !== null ? handleAnnotationSave : handleSave}>
          {editIndex !== null ? 'Save Annotation' : 'Save Image'}
        </button>
        <Stage
          width={500}
          height={500}
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
      <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
        <ul>
          {annotations.map((annotation, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <p onClick={() => handleEditAnnotation(index)}>{annotation.text}</p>
              <button onClick={() => handleDeleteAnnotation(index)} style={{ marginLeft: '5px' }}>✖</button>
            </li>
          ))}
        </ul>
      </div>
      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Edit Annotation
          </Typography>
          <Input
            label="Title"
            name="text"
            value={text}
            onChange={handleAnnotationChange}
            fullWidth
            margin="normal"
          />
          <Input
            label="Description"
            name="description"
            value={description}
            onChange={handleAnnotationChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" onClick={handleAnnotationSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const App = () => {
  const [imageUrl, setImageUrl] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      {imageUrl ? (
        <AnnotatedImage src={imageUrl} />
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px dashed #ccc'
          }}
        >
          Drag & Drop Image Here
        </div>
      )}
    </div>
  );
};

export default App;