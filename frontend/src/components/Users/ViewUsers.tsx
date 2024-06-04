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
                <MenuItem>Изменить</MenuItem>
                <Divider />
                <MenuItem color="danger">Delete</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function UserTable() {
    const [rows, setRow] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        role: '',
    });
    
    const [groups, setGroups] = useState([]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (name, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDatas = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formDatas as any).entries());

        try {
            const response = await axios.post('http://localhost:5000/users', formJson);
            console.log(response.data);
            fetchUser();
            handleClose();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };
    
    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:5000/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching methodologists:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setRow(response.data);
        } catch (error) {
            console.error('Error fetching spravki:', error);
            setRow([]);
        }
    };

    React.useEffect(() => {
        fetchUser();
        fetchGroups();
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
                    Пользователи
                </Typography>
                <Box sx={{
                    display: 'flex',
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                }}>
                <Button variant="solid" color="primary" onClick={handleOpen}>
                    Добавить пользователя
                </Button>
                </Box>
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
                            <th style={{ width: 120, padding: '12px 6px' }}>Id</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Почта</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Имя пользователя</th>
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
                                    <Typography level="body-xs">{row.email}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.username}</Typography>
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
                        width: '400px',
                        maxWidth: '100%',
                    }}
                >
                    <ModalClose onClick={handleClose} />
                    <Typography id="add-user-modal" level="h6" component="h2">
                        Добавить нового пользователя
                    </Typography>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <FormControl >
                            <FormLabel>Почта</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Имя пользователя</FormLabel>
                            <Input
                                type="text"
                                name="username"
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Пароль</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Роль</FormLabel>
                            <Select
                                name="role"
                                onChange={(e, value) => handleChange("role", value)}
                                required
                            >
                                <Option value="admin">Администратор</Option>
                                <Option value="methodologist">Методист</Option>
                                <Option value="hostel-employee">Работник общежития</Option>
                                <Option value="student">Студент</Option>
                            </Select>
                        </FormControl>
                        {formData.role === 'student' && (
                            <FormControl sx={{ mt: 2 }}>
                                <FormLabel>Группа</FormLabel>
                                <Select
                                    name="group_id"
                                    required
                                >
                                     {groups.map((group) => (
                                    <Option key={group.id} value={group.id}>
                                        {group.name}
                                    </Option>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                         {formData.role === 'hostel-employee' && (
                            <>
                            <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Номер общежития</FormLabel>
                            <Input
                                type="text"
                                name="numberDormitory"
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Тип специалиста</FormLabel>
                            <Input
                                type="text"
                                name="typeSpecialist"
                                required
                            />
                        </FormControl></>
                          
                       
                        )}
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Сохранить
                        </Button>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}