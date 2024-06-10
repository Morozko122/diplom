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
import CustomTable from '../Table/CustomTableComponents';
import { API_BASE_URL } from '../../../config';

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

const instance = axios.create({
    timeout: 1000,
    
  });


export default function UserTable({token}) {
    const headers = {
        headers:
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `application/json`
        }
      }
    const [rows, setRow] = useState([]);
    const [formData, setFormData] = useState({

    });
    console.log(formData);

    const [selectedRow, setSelectedRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleRowClick = (row) => {
        setSelectedRow(row);
        fetchUserFullInfo(row.id)
        handleOpenEdit()
    };

    const handleClose = () => {
        setFormData({});
        handleCloseEdit()
        setSelectedRow(null);
    };

    const [groups, setGroups] = useState([]);

    const columns = [
        { field: 'id', title: 'ID' },
        { field: 'email', title: 'Почта' },
        { field: 'username', title: 'Имя пользователя' },
    ];


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
            var response;
            if(selectedRow&& selectedRow.id != null) {
                response = await axios.put(`${API_BASE_URL}/users/${selectedRow.id}/full`, formJson, headers);
            }
            else response = await axios.post(`${API_BASE_URL}/users`, formJson, headers);
            console.log(response.data);
            fetchUser();
            handleClose();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/groups`, headers);

            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching methodologists:', error);
        }
    };

    const fetchUser = async () => {
        try {

            const response = await axios.get(`${API_BASE_URL}/users`, headers);

            setRow(response.data);
        } catch (error) {
            console.error('Error fetching spravki:', error);
            setRow([]);
        }
    };
    const fetchUserFullInfo = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${id}/fullinfo`, headers);

            setFormData(response.data);
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
                    <Button variant="solid" color="primary" onClick={handleOpenEdit}>
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
            <CustomTable columns={columns} data={rows} typeTable={"admin"} handleRowClick={handleRowClick} />
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
                                value={formData.email}
                                onChange={(e) =>  handleChange("email", e.target.value)}
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Имя пользователя</FormLabel>
                            <Input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={(e) =>  handleChange("full_name", e.target.value)}
                                required
                            />
                        </FormControl>
                        
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Пароль</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                onKeyDown={(e) => {
                                    if (e.key === ' ') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Роль</FormLabel>
                            <Select
                                name="role"
                                onChange={(e, value) => value !=''? handleChange("role", value): null}
                                value={formData.role}
                                required
                            >
                                <Option value="admin">Администратор</Option>
                                <Option value="methodologist">Методист</Option>
                                <Option value="hostel-employee">Работник общежития</Option>
                                <Option value="student">Студент</Option>
                            </Select>
                        </FormControl>
                        {formData.role === 'student' && (
                            <>
                            <FormControl sx={{ mt: 2 }}>
                                <FormLabel>Группа</FormLabel>
                                <Select
                                    name="group_id"
                                    required
                                    value={formData.group_id}
                                    
                                >
                                    {groups.map((group) => (
                                        <Option key={group.id} value={group.id}>
                                            {group.name}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Проживает в общежитии</FormLabel>
                            <Select
                                name="liveInDormitory"
                                required
                                value={formData.liveInDormitory}
                                onChange={(e, value) => value !=''? handleChange("liveInDormitory", value): null}
                                
                            >
                                <Option value='True'>Да</Option>
                                <Option value="False">Нет</Option>
                              
                            </Select>
                        </FormControl>

                        {formData.liveInDormitory === 'True' && (
                            <>
                            <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>Номер общежития</FormLabel>
                                    <Input
                                        type="text"
                                        name="numberDormitory"
                                        value={formData.numberDormitory}
                                        onChange={(e) =>  handleChange("numberDormitory", e.target.value)}
                                        required
                                    />
                                </FormControl>
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>Номер комнаты</FormLabel>
                                    <Input
                                        type="text"
                                        name="numberRoom"
                                        value={formData.numberRoom}
                                        onChange={(e) =>  handleChange("numberRoom", e.target.value)}
                                        required
                                    />
                                </FormControl>
                            </>

                        )}
                        </>
                        )}
                        {formData.role === 'hostel-employee' && (
                            <>
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>Номер общежития</FormLabel>
                                    <Input
                                        type="text"
                                        name="numberDormitory"
                                        value={formData.numberDormitory}
                                        onChange={(e) =>  handleChange("numberDormitory", e.target.value)}
                                        required
                                    />
                                </FormControl>
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel>Тип специалиста</FormLabel>
                                    <Input
                                        type="text"
                                        name="typeSpecialist"
                                        value={formData.typeSpecialist}
                                        onChange={(e) =>  handleChange("typeSpecialist", e.target.value)}
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