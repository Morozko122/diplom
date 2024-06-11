// import React, { useState, useRef } from 'react';
// import { Stage, Layer, Image, Ellipse, Text, Group } from 'react-konva';
// import useImage from 'use-image';
// import Modal from '@mui/joy/Modal';
// import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';
// import TextField from '@mui/joy/TextField';
// import Button from '@mui/joy/Button';
// import { Input } from '@mui/joy';
// import List from '@mui/joy/List';
// import ListItem from '@mui/joy/ListItem';
// import ListItemButton from '@mui/joy/ListItemButton';
// import IconButton from '@mui/joy/IconButton';
// import Add from '@mui/icons-material/Add';
// import Delete from '@mui/icons-material/Delete';
// import { v4 as uuidv4 } from 'uuid';

// const AnnotatedImage = ({ src }) => {
//   const [image] = useImage(src);
//   const [annotations, setAnnotations] = useState([]);
//   const [text, setText] = useState('');
//   const [description, setDescription] = useState('');
//   const [editIndex, setEditIndex] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const stageRef = useRef(null);

//   const handleStageClick = (e) => {
//     if (editIndex !== null) {
//       setEditIndex(null);
//       setText('');
//       setDescription('');
//       return;
//     }

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
//         text: text,
//         description: description
//       }
//     ]);
//     setText('');
//     setDescription('');
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

//   const handleEditAnnotation = (index) => {
//     setEditIndex(index);
//     setText(annotations[index].text);
//     setDescription(annotations[index].description);
//     setModalIsOpen(true);
//   };

//   const handleAnnotationChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'text') {
//       setText(value);
//     } else if (name === 'description') {
//       setDescription(value);
//     }
//   };

//   const handleAnnotationSave = () => {
//     if (editIndex !== null) {
//       const updatedAnnotations = annotations.map((annotation, index) =>
//         index === editIndex ? { ...annotation, text: text, description: description } : annotation
//       );
//       setAnnotations(updatedAnnotations);
//       setEditIndex(null);
//       setText('');
//       setDescription('');
//       setModalIsOpen(false);
//     }
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setEditIndex(null);
//     setText('');
//     setDescription('');
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ flex: 1 }}>
//         <input
//           type="text"
//           name="text"
//           value={text}
//           onChange={handleAnnotationChange}
//           placeholder="Enter text"
//           style={{ marginBottom: '10px' }}
//         />
//         <input
//           type="text"
//           name="description"
//           value={description}
//           onChange={handleAnnotationChange}
//           placeholder="Enter description"
//           style={{ marginBottom: '10px' }}
//         />
//         <button onClick={editIndex !== null ? handleAnnotationSave : handleSave}>
//           {editIndex !== null ? 'Save Annotation' : 'Save Image'}
//         </button>
//         <Stage
//           width={500}
//           height={500}
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
//                 <Group
//                   draggable={true}
//                 >

//                 <Ellipse
//                   x={annotation.x}
//                   y={annotation.y}
//                   radiusX={50}
//                   radiusY={25}
//                   stroke="red"
//                   strokeWidth={2 / scale}
//                   draggable={false}
//                 />
//                 <Text
//                   x={annotation.x -20}
//                   y={annotation.y -10}
//                   text={annotation.text}
//                   fontSize={20}
//                   fill="black"
//                   draggable={false}
//                 />
//                 </Group>
//               </React.Fragment>
//             ))}
//           </Layer>
//         </Stage>
//       </div>
//       <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
//         <List sx={{ maxWidth: 300 }}>
//           {annotations.map((annotation, index) => (
//             <ListItem key={index}
//               endAction={
//                 <IconButton aria-label="Delete" size="sm" color="danger">
//                   <Delete onClick={() => handleDeleteAnnotation(index)} />
//                 </IconButton>
//               }
//             >
//               <ListItemButton onClick={() => handleEditAnnotation(index)}><p color='black'>{annotation.text}</p></ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </div>
//       <Modal open={modalIsOpen} onClose={closeModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             border: '2px solid #000',
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <Typography variant="h6" component="h2">
//             Edit Annotation
//           </Typography>
//           <Input
//             label="Title"
//             name="text"
//             value={text}
//             onChange={handleAnnotationChange}
//             fullWidth
//             margin="normal"
//           />
//           <Input
//             label="Description"
//             name="description"
//             value={description}
//             onChange={handleAnnotationChange}
//             fullWidth
//             margin="normal"
//           />
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Button variant="contained" onClick={handleAnnotationSave}>
//               Save
//             </Button>
//             <Button variant="outlined" onClick={closeModal}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
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
//     <React.Fragment>
//       <Box
//         sx={{
//           display: 'flex',
//           mb: 1,
//           gap: 1,
//           flexDirection: { xs: 'column', sm: 'row' },
//           alignItems: { xs: 'start', sm: 'center' },
//           flexWrap: 'wrap',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Typography level="h2" component="h1">
//           Редактор карты
//         </Typography>
//         <Box sx={{
//           display: 'flex',
//           mb: 1,
//           gap: 1,
//           flexDirection: { xs: 'column', sm: 'row' },
//           alignItems: { xs: 'start', sm: 'center' },
//           flexWrap: 'wrap',
//           justifyContent: 'space-between',
//         }}>
//         </Box>
//       </Box>
//       <div>
//         {imageUrl ? (
//           <AnnotatedImage src={imageUrl} />
//         ) : (
//           <div
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             style={{
//               width: '100%',
//               height: '100vh',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               border: '2px dashed #ccc'
//             }}
//           >
//             Drag & Drop Image Here
//           </div>
//         )}
//       </div>
//     </React.Fragment>
//   );
// };

// export default App;


// import React, { useState, useRef } from 'react';
// import { Stage, Layer, Image, Ellipse, Text, Group } from 'react-konva';
// import useImage from 'use-image';
// import Modal from '@mui/joy/Modal';
// import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';
// import { Input } from '@mui/joy';
// import Button from '@mui/joy/Button';
// import List from '@mui/joy/List';
// import ListItem from '@mui/joy/ListItem';
// import ListItemButton from '@mui/joy/ListItemButton';
// import IconButton from '@mui/joy/IconButton';
// import Delete from '@mui/icons-material/Delete';
// import { v4 as uuidv4 } from 'uuid';

// const AnnotatedImage = ({ src }) => {
//   const [image] = useImage(src);
//   const [annotations, setAnnotations] = useState([]);
//   const [text, setText] = useState('');
//   const [description, setDescription] = useState('');
//   const [editIndex, setEditIndex] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const stageRef = useRef(null);

//   const handleStageClick = (e) => {
//     if (editIndex !== null) {
//       setEditIndex(null);
//       setText('');
//       setDescription('');
//       return;
//     }

//     const stage = stageRef.current;
//     const pointerPosition = stage.getPointerPosition();
//     const mousePointTo = {
//       x: (pointerPosition.x - stage.x()) / stage.scaleX(),
//       y: (pointerPosition.y - stage.y()) / stage.scaleY()
//     };
//     setAnnotations([
//       ...annotations,
//       {
//         id: uuidv4(),
//         x: mousePointTo.x,
//         y: mousePointTo.y,
//         text: text,
//         description: description
//       }
//     ]);
//     setText('');
//     setDescription('');
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

//   const handleDeleteAnnotation = (id) => {
//     const newAnnotations = annotations.filter((annotation) => annotation.id !== id);
//     setAnnotations(newAnnotations);
//   };

//   const handleEditAnnotation = (id) => {
//     const annotation = annotations.find((annotation) => annotation.id === id);
//     setEditIndex(id);
//     setText(annotation.text);
//     setDescription(annotation.description);
//     setModalIsOpen(true);
//   };

//   const handleAnnotationChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'text') {
//       setText(value);
//     } else if (name === 'description') {
//       setDescription(value);
//     }
//   };

//   const handleAnnotationSave = () => {
//     if (editIndex !== null) {
//       const updatedAnnotations = annotations.map((annotation) =>
//         annotation.id === editIndex ? { ...annotation, text: text, description: description } : annotation
//       );
//       setAnnotations(updatedAnnotations);
//       setEditIndex(null);
//       setText('');
//       setDescription('');
//       setModalIsOpen(false);
//     }
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setEditIndex(null);
//     setText('');
//     setDescription('');
//   };

//   const handleDragEnd = (e, id) => {
//     const newAnnotations = annotations.map((annotation) =>
//       annotation.id === id
//         ? {
//           ...annotation,
//           x: e.target.x(),
//           y: e.target.y(),
//         }
//         : annotation
//     );
//     setAnnotations(newAnnotations);
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ flex: 1 }}>
//         <input
//           type="text"
//           name="text"
//           value={text}
//           onChange={handleAnnotationChange}
//           placeholder="Enter text"
//           style={{ marginBottom: '10px' }}
//         />
//         <input
//           type="text"
//           name="description"
//           value={description}
//           onChange={handleAnnotationChange}
//           placeholder="Enter description"
//           style={{ marginBottom: '10px' }}
//         />
//         <button onClick={editIndex !== null ? handleAnnotationSave : handleSave}>
//           {editIndex !== null ? 'Save Annotation' : 'Save Image'}
//         </button>
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
//             {annotations.map((annotation) => (
//               <Group
//                 key={annotation.id}
//                 x={annotation.x}
//                 y={annotation.y}
//                 draggable
//                 onDragEnd={(e) => handleDragEnd(e, annotation.id)}
//               >
//                 <Ellipse
//                   x={0}
//                   y={0}
//                   radiusX={50}
//                   radiusY={25}
//                   stroke="red"
//                   strokeWidth={2 / scale}
//                   draggable={false}
//                 />
//                 <Text
//                   x={-20}
//                   y={-10}
//                   text={annotation.text}
//                   fontSize={20}
//                   fill="black"
//                   draggable={false}
//                 />
//               </Group>
//             ))}
//           </Layer>
//         </Stage>
//       </div>
//       <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
//         <List sx={{ maxWidth: 300 }}>
//           {annotations.map((annotation) => (
//             <ListItem
//               key={annotation.id}
//               endAction={
//                 <IconButton aria-label="Delete" size="sm" color="danger" onClick={() => handleDeleteAnnotation(annotation.id)}>
//                   <Delete />
//                 </IconButton>
//               }
//             >
//               <ListItemButton onClick={() => handleEditAnnotation(annotation.id)}>
//                 <p color="black">{annotation.text}</p>
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </div>
//       <Modal open={modalIsOpen} onClose={closeModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             border: '2px solid #000',
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <Typography variant="h6" component="h2">
//             Edit Annotation
//           </Typography>
//           <Input
//             label="Title"
//             name="text"
//             value={text}
//             onChange={handleAnnotationChange}
//             fullWidth
//             margin="normal"
//           />
//           <Input
//             label="Description"
//             name="description"
//             value={description}
//             onChange={handleAnnotationChange}
//             fullWidth
//             margin="normal"
//           />
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Button variant="contained" onClick={handleAnnotationSave}>
//               Save
//             </Button>
//             <Button variant="outlined" onClick={closeModal}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
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
//     <React.Fragment>
//       <Box
//         sx={{
//           display: 'flex',
//           mb: 1,
//           gap: 1,
//           flexDirection: { xs: 'column', sm: 'row' },
//           alignItems: { xs: 'start', sm: 'center' },
//           flexWrap: 'wrap',
//           justifyContent: 'space-between',
//         }}
//       >
//         <Typography level="h2" component="h1">
//           Редактор карты
//         </Typography>
//       </Box>
//       <div>
//         {imageUrl ? (
//           <AnnotatedImage src={imageUrl} />
//         ) : (
//           <div
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             style={{
//               width: '100%',
//               height: '100vh',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               border: '2px dashed #ccc'
//             }}
//           >
//             Drag & Drop Image Here
//           </div>
//         )}
//       </div>
//     </React.Fragment>
//   );
// };

// export default App;



import React, { useState, useRef } from 'react';
import { Stage, Layer, Image, Ellipse, Text, Group } from 'react-konva';
import useImage from 'use-image';
import Modal from '@mui/joy/Modal';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { Input } from '@mui/joy';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import IconButton from '@mui/joy/IconButton';
import Delete from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

const AnnotatedImage = ({ src }) => {
  const [image] = useImage(src);
  const [annotations, setAnnotations] = useState([]);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pixelRatio, setPixelRatio] = useState(3); // Default to 2 for high quality
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
        id: uuidv4(),
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
    const stage = stageRef.current;
  
    // Сохранение текущих параметров
    const oldScale = stage.scaleX();
    const oldPosition = { x: stage.x(), y: stage.y() };
  
    // Установка масштаба и положения по умолчанию
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
  
    // Вычисление крайних координат
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
    // Координаты вставленной картинки
    if (image) {
      minX = Math.min(minX, 0);
      minY = Math.min(minY, 0);
      maxX = Math.max(maxX, image.width);
      maxY = Math.max(maxY, image.height);
    }
  
    // Координаты аннотаций
    annotations.forEach(annotation => {
      minX = Math.min(minX, annotation.x - 50);  // 50 - это радиус эллипса
      minY = Math.min(minY, annotation.y - 25);  // 25 - это радиус эллипса
      maxX = Math.max(maxX, annotation.x + 50);
      maxY = Math.max(maxY, annotation.y + 25);
    });
  
    // Добавление небольшого отступа
    const padding = 20;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
  
    // Установка размеров для Stage
    const width = maxX - minX;
    const height = maxY - minY;
  
    // Установка позиции для Stage
    stage.width(width);
    stage.height(height);
    stage.position({ x: -minX, y: -minY });
  
    // Получение изображения с высоким разрешением
    const uri = stage.toDataURL({ pixelRatio });
  
    // Восстановление старых параметров
    stage.scale({ x: oldScale, y: oldScale });
    stage.position(oldPosition);
    stage.width(window.innerWidth - 200); // Восстановление ширины холста
    stage.height(window.innerHeight); // Восстановление высоты холста
  
    // Сохранение изображения
    const link = document.createElement('a');
    link.download = 'annotated-image.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleDeleteAnnotation = (id) => {
    const newAnnotations = annotations.filter((annotation) => annotation.id !== id);
    setAnnotations(newAnnotations);
  };

  const handleEditAnnotation = (id) => {
    const annotation = annotations.find((annotation) => annotation.id === id);
    setEditIndex(id);
    setText(annotation.text);
    setDescription(annotation.description);
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
      const updatedAnnotations = annotations.map((annotation) =>
        annotation.id === editIndex ? { ...annotation, text: text, description: description } : annotation
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

  const handleDragEnd = (e, id) => {
    const newAnnotations = annotations.map((annotation) =>
      annotation.id === id
        ? {
            ...annotation,
            x: e.target.x(),
            y: e.target.y(),
          }
        : annotation
    );
    setAnnotations(newAnnotations);
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
          width={window.innerWidth - 200}
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
            {annotations.map((annotation) => (
              <Group
                key={annotation.id}
                x={annotation.x}
                y={annotation.y}
                draggable
                onDragEnd={(e) => handleDragEnd(e, annotation.id)}
              >
                <Ellipse
                  x={0}
                  y={0}
                  radiusX={50}
                  radiusY={25}
                  stroke="red"
                  strokeWidth={2}
                  draggable={false}
                />
                <Text
                  x={-20}
                  y={-10}
                  text={annotation.text}
                  fontSize={20}
                  fill="black"
                  draggable={false}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
      <div style={{ width: '200px', padding: '10px', borderRight: '1px solid black' }}>
        <List sx={{ maxWidth: 300 }}>
          {annotations.map((annotation) => (
            <ListItem
              key={annotation.id}
              endAction={
                <IconButton aria-label="Delete" size="sm" color="danger" onClick={() => handleDeleteAnnotation(annotation.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => handleEditAnnotation(annotation.id)}>
                <p color="black">{annotation.text}</p>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2" component="h1">
          Редактор карты
        </Typography>
      </Box>
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
    </React.Fragment>
  );
};

export default App;