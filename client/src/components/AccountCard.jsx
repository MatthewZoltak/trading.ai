// src/components/AccountCard/AccountCard.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function AccountCard({ type, balance }) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              {type}
            </Typography>
            <Typography color="textSecondary">
              Non-registered
            </Typography>
          </Box>
          <Typography variant="h6">
            {balance}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AccountCard;