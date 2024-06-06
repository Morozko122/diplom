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

export default function GroupTable() {
    const [rows, setRow] = useState([]);
    const [openGroup, setGroupOpen] = useState(false);

    const [methodologists, setMethodologists] = useState([]);
    const [groups, setGroups] = useState([]);

    const handleGroupOpen = () => setGroupOpen(true);
    const handleGroupClose = () => setGroupOpen(false);

    const handleSubmitGroup = async (event) => {
        event.preventDefault();
        const formDatas = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formDatas as any).entries());
        try {
            await axios.post(`${API_BASE_URL}/groups`, formJson);

            handleGroupClose();
            fetchGroups();
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    const fetchMethodologists = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/methodologists`);
            setMethodologists(response.data);
        } catch (error) {
            console.error('Error fetching methodologists:', error);
        }
    };
    
    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/groups`);
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching methodologists:', error);
        }
    };


    React.useEffect(() => {
        fetchMethodologists();
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
    const columns = [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Название' },
        { field: 'methodologist_id', title: 'ID работника' },
        { field: 'methodologist', title: 'ФИО работника' },
    ];
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
                    Группы
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
                <Button variant="solid" color="primary" onClick={handleGroupOpen}>
                    Создать группу
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
            <CustomTable columns={columns} data={groups}/>
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
            <Modal open={openGroup} onClose={handleGroupClose}>
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
                    <ModalClose onClick={handleGroupClose} />
                    <Typography id="add-user-modal" level="h6" component="h2">
                        Создать группу
                    </Typography>
                    <form onSubmit={handleSubmitGroup}>
                        <FormControl >
                            <FormLabel>Наименование группы</FormLabel>
                            <Input
                                type="text"
                                name="groupName"
                                required
                            />
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <FormLabel>Методист</FormLabel>
                            <Select
                                name="methodologist"
                                required
                            >
                                {methodologists.map((methodologist) => (
                                    <Option key={methodologist.id} value={methodologist.id}>
                                        {methodologist.full_name}
                                    </Option>
                                ))}
                            </Select>
                        </FormControl>
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