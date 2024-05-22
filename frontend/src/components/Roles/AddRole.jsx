import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { Box, Button, FormControl, FormLabel, Input, Typography } from '@mui/joy';

const AddRole = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRole = {
            name,
            description,
            permissions: permissions.split(','),
        };
        try {
            await axios.post(`${API_BASE_URL}/roles`, newRole);
            alert('Role added successfully');
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                margin: '0 auto',
                maxWidth: 400,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Add New Role
            </Typography>
            <FormControl sx={{ marginBottom: 2, width: '100%' }}>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl sx={{ marginBottom: 2, width: '100%' }}>
                <FormLabel>Description</FormLabel>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>
            <FormControl sx={{ marginBottom: 2, width: '100%' }}>
                <FormLabel>Permissions (comma separated)</FormLabel>
                <Input
                    value={permissions}
                    onChange={(e) => setPermissions(e.target.value)}
                />
            </FormControl>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
            >
                Add Role
            </Button>
        </Box>
    );
};

export default AddRole;
