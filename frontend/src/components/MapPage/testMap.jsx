import React from 'react';
import { Box, Button, IconButton, Typography, List, ListItem, ListItemText } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';

export default function MapEditor(){
    return(
        <React.Fragment>
            <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Top Bar */}
        <Box p={2} borderBottom="1px solid gray">
          <Typography>xeui@cm.cd</Typography>
        </Box>
        
        {/* Main Area */}
        <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" border="2px solid red">
          <Typography>Переместите изображение чтобы начать</Typography>
        </Box>
      </Box>
      
      {/* Right Sidebar */}
      <Box width="200px" bgcolor="lightgray" p={2} display="flex" flexDirection="column">
        <Button variant="contained" color="primary" sx={{ mb: 2, borderColor: 'blue' }}>
          Создать метку
        </Button>
        <Button variant="contained" color="secondary" sx={{ mb: 2, borderColor: 'orange' }}>
          Редактирование
        </Button>
        <Box flexGrow={1} display="flex" flexDirection="column" alignItems="center" border="2px solid purple" p={1}>
          {[504, 302, 110, 928].map((label, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              p={1}
              mb={1}
              bgcolor="yellow"
              borderRadius="4px"
            >
              <Typography>{label}</Typography>
              <IconButton size="small" color="error">
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        </Box>

        </React.Fragment>
    )
}