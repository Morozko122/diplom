/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { useState } from 'react';
import {
    Box,
    Button,
    Table,
    Typography,
    FormControl,
    FormLabel,
    Select,
    Option,
    Sheet,
    Modal,
    Input,
    ModalDialog,
    ModalClose,
    Checkbox
} from '@mui/joy';
import axios from 'axios';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Menu from '@mui/joy/Menu';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Divider from '@mui/joy/Divider';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function RoleTable() {
  const [rows, setRow] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      permissions: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
      try {
          const response = await axios.post('http://localhost:5000/roles', formData);
          console.log(response.data);
          fetchRoles();
          handleClose();
      } catch (error) {
          console.error('Error adding user:', error);
      }
  };

  const fetchRoles = async () => {
      try {
          const response = await axios.get('http://localhost:5000/roles');
          setRow(response.data);
      } catch (error) {
          console.error('Error fetching spravki:', error);
          setRow([]);
      }
  };

  React.useEffect(() => {
    fetchRoles(1);
  }, []);


  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="refunded">Refunded</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="refund">Refund</Option>
          <Option value="purchase">Purchase</Option>
          <Option value="debit">Debit</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Customer</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
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
              Роли
            </Typography>
            <Button variant="solid" color="primary" onClick={handleOpen}>
                    Создать роль
                </Button>
          </Box>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              {/* <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>              </th> */}
              <th style={{ width: 120, padding: '12px 6px' }}>Id</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Название</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Права</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.name}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.permissions}</Typography>
                </td>
               
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Next
        </Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
                <ModalDialog
                    aria-labelledby="add-user-modal"
                    aria-describedby="add-user-modal-description"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px'
                    }}
                >
                    <ModalClose onClick={handleClose} />
                    <Typography id="add-user-modal" level="h6" component="h2">
                        Создать новую роль
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <FormLabel>Название роли</FormLabel>
                            <Input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <FormLabel>Разрешения</FormLabel>
                            <Input
                                type="text"
                                name="permissions"
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <Button
                            fullWidth
                            variant="solid"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ mt: 2 }}
                        >
                            Сохранить
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
    </React.Fragment>
  );
}
