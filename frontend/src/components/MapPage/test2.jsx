
import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Image, Ellipse, Text, Group } from 'react-konva';
import useImage from 'use-image';
import { ModalClose, ModalDialog, Modal, FormControl, FormLabel } from '@mui/joy';
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
import axios from 'axios';
import { API_BASE_URL } from '../../../config';


const NewMap = () => {
  const [imageUrl, setImageUrl] = useState('');
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(event.target.result);
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
          Новая карта
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
              width: '900px',
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px dashed #ccc'
            }}
          >
            Перенесите изображение сюда
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

const AnnotatedImage = ({ src, initialAnnotations }) => {

  const [image] = useImage(src);


  const [annotations, setAnnotations] = useState(initialAnnotations || []);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [numberCampus, setnumberCampus] = useState('');
  const [numberFloor, setnumberFloor] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pixelRatio, setPixelRatio] = useState(3);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    setAnnotations(initialAnnotations || []);
  }, [initialAnnotations]);

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
      const annotationX = annotation.x * oldScale + oldPosition.x;
      const annotationY = annotation.y * oldScale + oldPosition.y;

      minX = Math.min(minX, annotationX - 50 * oldScale);  // 50 - это радиус эллипса
      minY = Math.min(minY, annotationY - 25 * oldScale);  // 25 - это радиус эллипса
      maxX = Math.max(maxX, annotationX + 50 * oldScale);
      maxY = Math.max(maxY, annotationY + 25 * oldScale);
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
    stage.width(900); // Восстановление ширины холста
    stage.height(900); // Восстановление высоты холста

    console.log(uri);
    console.log(image);
    // Отправка данных на сервер
    fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: JSON.stringify({
        campus: numberCampus,
        floor: numberFloor,
        imagename: uuidv4(),
        image: uri,
        imageBase: image.src,
        annotations: annotations
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
    if (name === 'numberCampus') {
      setnumberCampus(value);
    } else if (name === 'numberFloor') {
      setnumberFloor(value);
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
    <>
        <Box sx={{ display: 'flex', flex: 2, height: '90vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 3, overflow: 'hidden', padding: '5px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', marginBottom: '10px' }}>
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
      <label>Данные метки</label>
      <Input
        type="text"
        name="text"
        value={text}
        onChange={handleAnnotationChange}
        placeholder="Название метки"
        sx={{ marginBottom: '10px' }}
      />
      <Input
        type="text"
        name="description"
        value={description}
        onChange={handleAnnotationChange}
        placeholder="Описание метки"
        sx={{ marginBottom: '10px' }}
      />
    </Box>
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
      <label>Данные карты</label>
      <Input
        type="text"
        name="numberCampus"
        value={numberCampus}
        onChange={handleAnnotationChange}
        placeholder="Номер корпуса"
        sx={{ marginBottom: '10px' }}
      />
      <Input
        type="text"
        name="numberFloor"
        value={numberFloor}
        onChange={handleAnnotationChange}
        placeholder="Номер этажа"
        sx={{ marginBottom: '10px' }}
      />
    </Box>
  </Box>
        <Button onClick={handleSave}>Сохранить</Button>
        <Stage
          width={900}
          height={900}  // Adjust height to prevent overflow
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          ref={stageRef}
          onWheel={handleWheel}
          draggable
          onClick={handleStageClick}
          style={{ flex: 1 }} // Ensure it flexes with its parent
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
      </Box>
      <Box sx={{ width: '200px', padding: '10px', borderLeft: '1px solid black', overflowY: 'auto' }}>
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
      </Box>
      <Modal open={modalIsOpen} onClose={closeModal}>
          <ModalDialog
                aria-labelledby="edit-annotation-modal"
                aria-describedby="edit-annotation-modal-description"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '400px',
                  maxWidth: '100%',
              }}
            >
                <ModalClose onClick={closeModal} />
                <Typography id="edit-annotation-modal" level="h6" component="h2">
                    Редактировать метку
                </Typography>
                <form>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Наименование</FormLabel>
                        <Input
                            type="text"
                            name="text"
                            value={text}
                            onChange={handleAnnotationChange}
                            required
                        />
                    </FormControl>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>Описание</FormLabel>
                        <Input
                            type="text"
                            name="description"
                            value={description}
                            onChange={handleAnnotationChange}
                            required
                        />
                    </FormControl>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button type="button" variant="solid" color="primary" sx={{ mt: 2 }} onClick={handleAnnotationSave}>
                            Сохранить
                        </Button>
                        <Button type="button" variant="solid" color="primary" sx={{ mt: 2 }} onClick={closeModal}>
                            Отмена
                        </Button>
                    </Box>
                </form>
            </ModalDialog>
        </Modal>
    </Box>
    </>
  );
};


const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isNew, setisNew] = useState(false);
  const [file, setFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  console.log("fdsfsdfsd")
  console.log(selectedImage)

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/maps`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('annotations', JSON.stringify(annotations));

    try {
      await axios.post(`${API_BASE_URL}/upload`, formData);
      setIsModalOpen(false);
      fetchImages();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleImageClick = async (image) => {
    try {
      const annotationsResponse = await axios.get(`${API_BASE_URL}/annotations/${image.filename}`);
      // Разделить имя файла и расширение
      const parts = image.filename.split(".");
      const name = parts[0];

      const newFilename = `${name}_base.jpg`;
      const imageResponse = await axios.get(`${API_BASE_URL}/files/${newFilename}`, {
        responseType: 'blob'
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage({
          src: event.target.result,
          annotations: annotationsResponse.data
        });
      };

      reader.readAsDataURL(imageResponse.data);
    } catch (error) {
      console.error('Error fetching annotations:', error);
    }
  };
  const styles = {
    listItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid black',
      borderRadius: '10px',
      padding: '10px',
      marginBottom: '10px',
      '&:hover': {
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',
      },
    },
    filenameBox: {
      border: '1px solid black',
      borderRadius: '5px',
      padding: '5px 10px',
      marginRight: '20px',
      backgroundColor: '#fff', // White background
    },
    filenameText: {
      fontWeight: 'bold',
    },
    deleteIcon: {
      color: 'red', // Red color for the delete icon
    },
  };
  return (
    <Box sx={{ p: 3 }}>
      {!selectedImage && isNew !== true && (
        <>
           <Typography level="h2">Карты</Typography>
      <Button sx={{ marginTop: '8px'}} onClick={() => setisNew(true)}>
        Создать новый этаж
      </Button>
          <List sx={{ mt: 3 }}>
            {images.map((image) => (
              <ListItem key={image.filename} sx={styles.listItem} onClick={() => handleImageClick(image)}>
                <Box sx={styles.filenameBox}>
                  <Typography sx={styles.filenameText}>{image.campus}/{image.floor}</Typography>
                </Box>
                <Typography>Корпус {image.campus}, Этаж {image.floor}</Typography>
                <IconButton
                  aria-label="Delete"
                  size="large"
                  sx={styles.deleteIcon}
                  onClick={() => console.log('Delete functionality not implemented')}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {isNew === true && <NewMap />}
      {selectedImage && (
        <AnnotatedImage src={selectedImage.src} initialAnnotations={selectedImage.annotations} />
      )}
    </Box>
  );
};

export default App;