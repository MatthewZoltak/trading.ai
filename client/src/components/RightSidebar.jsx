// src/components/RightSidebar/RightSidebar.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'; // Import Stack

function RightSidebar() {
    return (
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={2}> {/* Changed justifyContent */}
          <Button variant="contained" color="primary" sx={{ flexGrow: 1 }}> {/* Added flexGrow */}
            Add money
          </Button>
          <Button variant="contained" color="primary" sx={{ flexGrow: 1 }}> {/* Added flexGrow */}
            Move money
          </Button>
        </Stack>
          <Divider sx={{my: 2}}/>
          <Button variant="outlined" color="primary" fullWidth sx={{mb: 2}}>
              + Add an account
          </Button>  
      </Box>
    );
  }

export default RightSidebar;