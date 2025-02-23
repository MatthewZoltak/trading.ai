// src/components/Balance/Balance.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

function Balance() {
  return (
    <Box textAlign="left" p={4}>
      <Typography variant="h4" gutterBottom>
        $0.00
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Once you fund your first account, your performance will appear here.
      </Typography>
    </Box>
  );
}

export default Balance;