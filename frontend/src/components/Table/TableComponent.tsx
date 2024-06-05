import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Checkbox from '@mui/joy/Checkbox';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import { useState } from 'react';
import {
  Button,
  Modal,
  Input,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Option,
  Select
 
} from '@mui/joy';
import axios from 'axios';

interface TableComponentProps {
  columns: string[];
  rows: any[];
  selected: readonly string[];
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>;
  token: string;
  fetchApplication: any;
  userId: number;
  role: any
}


const TableComponent: React.FC<TableComponentProps> = ({ columns, rows, selected, setSelected, token, fetchApplication: fetchSpravki, userId, role}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const updateApplication = async (newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/update_application/${selectedRow?.id}`, {
        headers:
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `application/json`
        },
        "status":newStatus
      });
      handleCloseEdit();
      fetchSpravki(userId);
    } catch (error) {
      console.error('Error update:', error);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    handleOpenEdit()
  };

  const handleClose = () => {
    handleCloseEdit()
    setSelectedRow(null);
  };


  return (
    <>
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
          <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
            <Checkbox
              size="sm"
              indeterminate={selected.length > 0 && selected.length !== rows.length}
              checked={selected.length === rows.length}
              onChange={(event) => {
                setSelected(event.target.checked ? rows.map((row) => row.id) : []);
              }}
              color={selected.length > 0 || selected.length === rows.length ? 'primary' : undefined}
              sx={{ verticalAlign: 'text-bottom' }}
            />
          </th>
          {columns.map((column, index) => (
            <th key={index} style={{ width: 120, padding: '12px 6px' }}>
              <Typography level="body-sm">{column}</Typography>
            </th>
          ))}
          <th style={{ width: 140, padding: '12px 6px' }}> </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} onClick={() => handleRowClick(row)}>
            <td style={{ textAlign: 'center', width: 120 }}>
              <Checkbox
                size="sm"
                checked={selected.includes(row.id)}
                color={selected.includes(row.id) ? 'primary' : undefined}
                onChange={(event) => {
                  setSelected((ids) =>
                    event.target.checked
                      ? ids.concat(row.id)
                      : ids.filter((itemId) => itemId !== row.id),
                  );
                }}
                slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                sx={{ verticalAlign: 'text-bottom' }}
              />
            </td>
            <td>
              <Typography level="body-xs">{row.id}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.personal_number}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.date}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.name}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.quantity}</Typography>
            </td>
            <td>
              <Chip
                variant="soft"
                size="sm"
                startDecorator={
                  {
                    "Готово": <CheckRoundedIcon />,
                    "В работе": <AutorenewRoundedIcon />,
                    Cancelled: <BlockIcon />,
                  }[row.status]
                }
                color={
                  {
                    "Готово": 'success',
                    "В работе": 'neutral',
                    Cancelled: 'danger',
                  }[row.status] as ColorPaletteProp
                }
              >
                {row.status}
              </Chip>
            </td>
            <td>
              <Typography level="body-xs">{row.full_name}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
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
          
          {selectedRow && (
            <>
              <Typography sx={{ mt: 2 }}>
                ID: {selectedRow.id}
              </Typography>
              <Typography sx={{ mt: 2 }}>
              Личный номер: {selectedRow.personal_number}
              </Typography>
              <Typography sx={{ mt: 2 }}>
              Дата: {selectedRow.date}
              </Typography>
              <Typography sx={{ mt: 2 }}>
              Наименование: {selectedRow.name}
              </Typography>
              <Typography sx={{ mt: 2 }}>
              Кол-во: {selectedRow.quantity}
              </Typography>
              <Typography sx={{ mt: 2 }}>
              Статус: {selectedRow.status}
              </Typography>
              <Typography sx={{ mt: 2 }}>
              ФИО студента: {selectedRow.full_name}
              </Typography>
            </>
          )}
            
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
              color="neutral"

              sx={{ mt: 2 }}
            >
              В работе
            </Button>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
  
};

export default TableComponent;
