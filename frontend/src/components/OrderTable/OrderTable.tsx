

import { useState } from 'react';
import * as React from 'react';
import axios from 'axios';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TableComponent from '../Table/TableComponent';
import useToken from '../useToken/useToken';
import CustomTable from '../Table/CustomTableComponents';
import {
  Button,
  Modal,
  Input,
  ModalDialog,
  ModalClose,
 
 
} from '@mui/joy';
import { API_BASE_URL } from '../../../config';


const DataDisplay = ({ selectedRow, columns }) => {
  return (
    <>
      {columns.map((column) => (
        <Typography key={column.field} sx={{ mt: 2 }}>
          {column.title}: {selectedRow[column.field]}
        </Typography>
      ))}
    </>
  );
};

export default function OrderTable({ token, role }) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const headers = {
    headers:
    {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `application/json`
    }
  }

  const handleRowClick = (row) => {
    setSelectedRow(row);
    handleOpenEdit()
  };

  const handleClose = () => {
    handleCloseEdit()
    setSelectedRow(null);
  };

  const [rows, setRow] = React.useState([]);
  
  const userId = localStorage.getItem('user_id');

  const updateApplication = async (newStatus) => {
    try {
      var url= `${API_BASE_URL}`;
      console.log(role)
      if(role == 'methodologist'){
        url = `${API_BASE_URL}/update_application/${selectedRow?.id}`;
      }
      else if (role  == 'hostel-employee') url = `${API_BASE_URL}/applicationDormitory/${selectedRow?.id}`
      const response = await axios.put(url, {
       
        "status":newStatus
      }, headers);
      handleCloseEdit();
      fetchApplication(userId);
    } catch (error) {
      console.error('Error update:', error);
    }
  };

  const fetchApplication = async (id) => {
    try {
      var url= `${API_BASE_URL}`;
      console.log(role)
      if(role == 'methodologist'){
        url = `${API_BASE_URL}/methodologists/${id}/applications`;
      }
      else if (role  == 'hostel-employee') url = `${API_BASE_URL}/workers/${id}/applications`
      const response = await axios.get(url,headers);
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setRow(sortedData);
      
    } catch (error) {
      console.error('Error fetching:', error);
      setRow([]);
    }
  };

  React.useEffect(() => {
    fetchApplication(userId);
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

  
  const columnsMethodologists = [
    { field: 'id', title: 'Номер заказа' },
    { field: 'personal_number', title: 'Личный номер' },
    { field: 'date', title: 'Дата' },
    { field: 'name', title: 'Наименование' },
    { field: 'quantity', title: 'Кол-во' },
    { field: 'full_name', title: 'ФИО студента' },
];
const columnsWorker = [
  { field: 'id', title: 'Номер заказа' },
  { field: 'personal_number', title: 'Личный номер' },
  { field: 'date', title: 'Дата' },
  { field: 'description', title: 'Описание' },
  { field: 'numberDormitory', title: 'Номер общежития' },
  { field: 'address', title: 'Адрес' },
  
];

const columns = role === "methodologist"? columnsMethodologists : columnsWorker;

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
          Заказы
        </Typography>
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
        {/* {renderFilters()} */}
      </Box>
      <CustomTable
        data={rows}
        columns={columns}
        typeTable={'application'}
        handleRowClick={handleRowClick}
        />

<Modal open={openEdit} onClose={handleClose}>
        <ModalDialog
          aria-labelledby="add-user-modal"
          aria-describedby="add-user-modal-description"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            maxWidth: '100%',
          }}
        >
          <ModalClose onClick={handleClose} />
          <Typography id="add-user-modal" level="h6" component="h2">
            Редактировать
          </Typography>
          <form> 
          
          {selectedRow && <DataDisplay selectedRow={selectedRow} columns={columns} />}
            
            <Button
              onClick={() => updateApplication('Готово')}
              variant="solid"
              color="success"

              sx={{ mt: 2, mr:2 }}
            >
              Готово
            </Button>
            <Button
              onClick={() => updateApplication('В работе')}
              variant="solid"
              color="primary"

              sx={{ mt: 2, mr:2 }}
            >
              В работе
            </Button>
            <Button
              onClick={() => updateApplication('Ожидание')}
              variant="solid"
              color="neutral"

              sx={{ mt: 2, mr:2 }}
            >
              Ожидание
            </Button>
          </form>
        </ModalDialog>
      </Modal>
      

      {/* <Box
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
          <Button
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </Button>
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
      </Box> */}

    </React.Fragment>
  );
}
