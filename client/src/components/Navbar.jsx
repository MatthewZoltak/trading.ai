// src/components/Navbar/Navbar.jsx (Revised)
import React, { useState } from 'react';
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
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout from context

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const navItems = [
    { text: 'Home', url: '/' },
    { text: 'Move', url: '/move' },
    { text: 'Activity', url: '/activity' },
    { text: 'Tax', url: '/tax' },
  ];

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.url}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {user ? (
        <ListItem disablePadding>
            <ListItemButton onClick={logout}>
                <ListItemText primary="Logout"/>
            </ListItemButton>
        </ListItem>
      ) : (
        <>
            <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/login">
                  <ListItemText primary="Login"/>
                </ListItemButton>
            </ListItem>
             <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/signup">
                    <ListItemText primary="Signup"/>
                </ListItemButton>
            </ListItem>
        </>

      )}
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
          W
        </Typography>

        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
          {/* Conditionally render navigation links */}
          {user ? (
            <>
              {navItems.map((item) => (
                <Button key={item.text} color="inherit" component={RouterLink} to={item.url}>
                  {item.text}
                </Button>
              ))}
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/signup">Signup</Button>
            </>
          )}
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search name or symbol"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <IconButton size="large" edge="end" color="inherit" aria-label="profile">
          <Avatar sx={{ bgcolor: 'grey.500' }} />
        </IconButton>

        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          {list}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;