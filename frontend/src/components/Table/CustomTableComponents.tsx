/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Box, Table, Typography, Sheet, tabClasses } from '@mui/joy';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Chip from '@mui/joy/Chip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import { ColorPaletteProp } from '@mui/joy/styles';

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

function CustomTable({ columns, data, typeTable }) {
  return (
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
            {columns.map((col) => (
              <th key={col.field} style={{ padding: '12px 6px',  width: ["id", "personal_number", "quantity", "date"].includes(col.field) ? '150px' : 'auto'  }}  >{col.title}</th>
            ))}
            {typeTable === 'application' && (<th key={"status"} style={{ padding: '12px 6px',  width: 120 }}>Статус</th>)}
            

          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.field}>
                  <Typography level="body-xs">{row[col.field]}</Typography>
                </td>
              ))}
              {typeTable === 'application' && (
                <>
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
                </>
              )}


            </tr>
          ))}


        </tbody>
      </Table>
    </Sheet>
  );
}

export default CustomTable;
