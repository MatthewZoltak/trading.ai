import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function AccountsPage() {
  const location = useLocation();
  const newAccount = location.state?.newAccount || null;

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/accounts');
        setAccounts(response.data.accounts);
        if (response.data.accounts.length > 0) {
          setSelectedAccount(response.data[0]); // Default to the first account
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    if (newAccount && !accounts.includes(newAccount)) {
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      setSelectedAccount(newAccount);
    }
  }, [newAccount, accounts]);

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Accounts</Typography>

      {accounts.length > 0 ? (
        <FormControl fullWidth>
          <InputLabel>Select an Account</InputLabel>
          <Select value={selectedAccount} onChange={handleAccountChange}>
            {accounts.map((account, index) => (
              <MenuItem key={index} value={account.name}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography>No accounts available. Add an account first.</Typography>
      )}

      <Typography variant="body1" mt={2}>
        {selectedAccount ? `Selected Account: ${selectedAccount}` : 'No account selected'}
      </Typography>
    </Box>
  );
}

export default AccountsPage;