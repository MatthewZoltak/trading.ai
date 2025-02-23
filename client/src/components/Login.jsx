// src/components/Login/Login.jsx
import React, { useState, useEffect } from 'react'; // Make sure useEffect is imported
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth(); // Get user from context
  const navigate = useNavigate();

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });
      const jwtToken = response.data.token;
      login(jwtToken);

    } catch (error) {
      console.error('Login error', error.response || error);
      setError(error.response?.data?.message || 'Login Failed');
    }
  };

  // useEffect for redirection
  useEffect(() => {
    if (user) { // Only check for user.  'loading' is handled in RequireAuth
      navigate('/');
    }
  }, [user, navigate]); // Depend only on user and navigate


  return (
    // ... (rest of your Login component's JSX remains the same) ...
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleRegularLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;