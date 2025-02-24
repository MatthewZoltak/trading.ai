import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccountCard from './AccountCard';
import Divider from '@mui/material/Divider';
import AccountCreationModal from './AccountCreationModal';

function Accounts() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleAccountCreate = (accountName) => {
    // Navigate to the accounts page and pass the new account in state
    navigate('/accounts', { state: { newAccount: accountName } });
    setModalOpen(false);
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Accounts</Typography>
      </Box>

      <AccountCard type="Non-registered" balance="$0.00" />

      <Button 
        variant="outlined" 
        color="primary" 
        fullWidth 
        sx={{ my: 2, textTransform: 'none', borderStyle: 'dashed' }}
        onClick={handleOpen}
      >
        + Add an account
      </Button>

      <Divider />

      <AccountCreationModal open={modalOpen} onClose={handleClose} onCreate={handleAccountCreate} />
    </Box>
  );
}

export default Accounts;
