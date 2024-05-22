import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  TextField,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SpravkiPage = () => {
  const [open, setOpen] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [spravkaName, setSpravkaName] = useState('');
  const [spravkaCount, setSpravkaCount] = useState('');
  
  const [spravki, setSpravki] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddSpravka = async () => {
    try {
      await axios.post('http://localhost:5000/applications/add', {
        personal_number: studentCode,
        name: spravkaName,
        quantity: spravkaCount,
        
      });
      alert('Spravka added successfully');
      handleClose();
      fetchSpravki();
    } catch (error) {
      console.error('Error adding spravka:', error);
    }
  };

  const fetchSpravki = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get_spravka/${studentCode}`);
      setSpravki(response.data);
    } catch (error) {
      console.error('Error fetching spravki:', error);
      setSpravki([]);
    }
  };

  useEffect(() => {
    if (studentCode) fetchSpravki();
  }, [studentCode]);

  return (
    <Container component="main">
      <CssBaseline />
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spravka Management
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Student Code"
            variant="outlined"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
            Add Spravka
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Student Code</TableCell>
                <TableCell>Spravka Name</TableCell>
                <TableCell>Spravka Count</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {spravki.map((spravka) => (
                <TableRow key={spravka.id}>
                  <TableCell>{spravka.id}</TableCell>
                  <TableCell>{spravka.personal_number}</TableCell>
                  <TableCell>{spravka.name}</TableCell>
                  <TableCell>{spravka.quantity}</TableCell>
                  <TableCell>{spravka.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Spravka
          </Typography>
          <TextField
            label="Student Code"
            variant="outlined"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Spravka Name"
            variant="outlined"
            value={spravkaName}
            onChange={(e) => setSpravkaName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Spravka Count"
            variant="outlined"
            type="number"
            value={spravkaCount}
            onChange={(e) => setSpravkaCount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddSpravka}>
            Submit
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default SpravkiPage;
