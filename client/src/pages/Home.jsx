// src/components/Home/Home.jsx
import React from 'react';
import Balance from '../components/Balance'
import Accounts from '../components/Accounts';
import RightSidebar from '../components/RightSidebar'
import { Grid, Container } from '@mui/material';  // Import Grid and Container

function Home() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}> {/* Use Grid for layout */}
        <Grid item xs={12} md={8}> {/* Left/Main Section - 8 columns on medium+ */}

          <Balance/>
          <Accounts />
        </Grid>
        <Grid item xs={12} md={4}> {/* Right Sidebar - 4 columns on medium+ */}
          <RightSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;