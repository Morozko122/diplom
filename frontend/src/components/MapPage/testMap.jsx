import React, { useRef, useState } from 'react';
import { Box, Button, List, ListItem, ListItemButton, IconButton, Modal, Typography, Input } from '@mui/material';
import { Stage, Layer, Image, Group, Ellipse, Text } from 'react-konva';
import Delete from '@mui/icons-material/Delete';

const AnnotatedImage = ({ annotations, image, handleAnnotationChange, handleSave, handleWheel, handleStageClick, handleDragEnd, handleDeleteAnnotation, handleEditAnnotation, handleAnnotationSave, closeModal, modalIsOpen, text, description, position, scale }) => {
  const stageRef = useRef();

  return (
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflow: 'auto', padding: '10px' }}>
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
        <Button onClick={handleSave}>Сохранить</Button>
        <Stage
          width={window.innerWidth - 200}
          height={window.innerHeight - 100}  // Adjust height to prevent overflow
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
    </Box>
  );
};

export default AnnotatedImage;
