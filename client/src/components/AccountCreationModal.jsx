import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AccountCreationModal = ({ open, onClose, onCreate }) => {
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!accountName.trim()) {
      setError('Account name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/accounts', { name: accountName });
      if (response.status === 201) {
        onCreate(response.data); // Pass the created account data back to the parent
        setAccountName('');
        onClose();
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={!loading ? onClose : undefined}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>Create a New Account</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Account Name"
            variant="outlined"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={loading}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={onClose} color="secondary" disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AccountCreationModal;
