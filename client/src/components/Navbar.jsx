import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import PurchaseStockModal from './PurchaseStockModal';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f0f0f0',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

function Navbar() {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null); // Store selected stock separately
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const symbol = searchQuery.trim().toUpperCase();
      if (!symbol) return;

      console.log("🔍 Searching for stock:", symbol);

      try {
        const response = await axios.get(`http://localhost:8000/api/search/stocks?symbol=${symbol}`);
        console.log("✅ Stock Data Received:", response.data);

        if (response.data.error) {
          setSearchResult(null);
        } else {
          setSearchResult(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching stock:", error);
        setSearchResult(null);
      }
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock); // Store the selected stock
    setIsModalOpen(true); // Open modal immediately
    setSearchResult(null); // Close dropdown
    setSearchQuery(''); // Clear search input
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
          W
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          {user && <Button color="inherit" component={RouterLink} to="/accounts">Accounts</Button>}
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Enter ticker..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </Search>

          {/* Search Results Dropdown */}
          {searchResult && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                mt: 1,
                bgcolor: 'background.paper',
              }}
              elevation={3}
            >
              <MenuItem onClick={() => handleStockClick(searchResult)}>
                {searchResult.symbol} - {searchResult.name} (${searchResult.last_price})
              </MenuItem>
            </Paper>
          )}
        </Box>

        <IconButton size="large" edge="end" color="inherit" aria-label="profile">
          <Avatar sx={{ bgcolor: 'grey.500' }} />
        </IconButton>

        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <List>
            <ListItemButton component={RouterLink} to="/">Home</ListItemButton>
            {user && <ListItemButton component={RouterLink} to="/accounts">Accounts</ListItemButton>}
            {user ? (
              <ListItemButton onClick={logout}>Logout</ListItemButton>
            ) : (
              <>
                <ListItemButton component={RouterLink} to="/login">Login</ListItemButton>
                <ListItemButton component={RouterLink} to="/signup">Signup</ListItemButton>
              </>
            )}
          </List>
        </Drawer>
      </Toolbar>

      {/* Purchase Stock Modal */}
      {selectedStock && (
        <PurchaseStockModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stock={selectedStock} // Pass the selected stock
        />
      )}
    </AppBar>
  );
}

export default Navbar;
