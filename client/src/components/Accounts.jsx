// src/components/Accounts/Accounts.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccountCard from './AccountCard'
import Divider from '@mui/material/Divider';

function Accounts() {
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Accounts</Typography>
        <Button variant="outlined" color="primary" size="small">
          Group view
        </Button>
      </Box>
      <AccountCard type="Non-registered" balance="$0.00" />
        <Button variant="outlined" color='primary' fullWidth sx={{ my: 2, textTransform: 'none', borderStyle: 'dashed' }}>
            + Add an account
        </Button>

      <Divider />
    </Box>
  );
}

export default Accounts;