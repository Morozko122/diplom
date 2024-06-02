import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import ColorSchemeToggle from '../ColorScheme/ColorSchemeToggle';
import { closeSidebar } from '../../utils';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}
// const logout = async () => {
//   try {
//     const response = await axios.post(`http://localhost:5000/logout`, {headers: 
//     {
//       'Authorization': `Bearer ${token}`, 
//       'Content-Type': `application/json`
//     }});
//   } catch (error) {
//     console.error('Error fetching spravki:', error);
//   }
// };
export default function Sidebar({ role, removeToken }) {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Link to="/main">
          <IconButton variant="soft" color="primary" size="sm">
            <BrightnessAutoRoundedIcon />
          </IconButton>
        </Link>
        <Typography level="title-lg">ТИУ</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>

      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >

          <ListItem>
            <ListItemButton selected>
              <AssignmentRoundedIcon />
              <Link to="/main">
              <ListItemContent>
                
                  <Typography level="title-sm">Заказы</Typography>
                
              </ListItemContent>
              </Link>
            </ListItemButton>
          </ListItem>
          {role === 'admin' && (
            <ListItem nested>
              <Toggler
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton onClick={() => setOpen(!open)}>
                    <GroupRoundedIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Администрирование</Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                    />
                  </ListItemButton>
                )}
              >
                <List sx={{ gap: 0.5 }}>
                  <Link to="/main/users">
                    <ListItemButton>
                      <ListItemContent>
                        <Typography level="title-sm">Пользователи</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </Link>
                  {/* <Link to="/main/roles">
                    <ListItemButton>
                      <ListItemContent>
                        <Typography level="title-sm">Роли</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </Link> */}
                  <Link to="/main/groups">
                    <ListItemButton>
                      <ListItemContent>
                        <Typography level="title-sm">Группы</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </Link>
                </List>
              </Toggler>
            </ListItem>
          )}
        </List>

        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >

        </List>

      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">Иванов И.И.</Typography>
          <Typography level="body-xs">ivanovii@test.com</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={() => removeToken()}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
