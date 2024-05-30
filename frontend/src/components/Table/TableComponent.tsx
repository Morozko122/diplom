import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Checkbox from '@mui/joy/Checkbox';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';

interface TableComponentProps {
  columns: string[];
  rows: any[];
  selected: readonly string[];
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>;
}


const TableComponent: React.FC<TableComponentProps> = ({ columns, rows, selected, setSelected }) => {
  return (
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
          <tr key={row.id}>
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
                    Paid: <CheckRoundedIcon />,
                    "В работе": <AutorenewRoundedIcon />,
                    Cancelled: <BlockIcon />,
                  }[row.status]
                }
                color={
                  {
                    Paid: 'success',
                    "В работе": 'neutral',
                    Cancelled: 'danger',
                  }[row.status] as ColorPaletteProp
                }
              >
                {row.status}
              </Chip>
            </td>
            <td>
              <Typography level="body-xs">{"ФИО"}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableComponent;
