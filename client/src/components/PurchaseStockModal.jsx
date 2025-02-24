import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function PurchaseStockModal({ open, onClose, stock }) {
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accounts from API
  useEffect(() => {
    if (open) {
      const fetchAccounts = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:8000/api/accounts');
          setAccounts(response.data.accounts);
          setError(null);
        } catch (err) {
          console.error("❌ Error fetching accounts:", err);
          setError('Failed to load accounts');
        } finally {
          setLoading(false);
        }
      };

      fetchAccounts();
    }
  }, [open]); // Re-fetch accounts whenever modal opens

  const handleQuantityChange = (e) => {
    const value = e.target.value.trim();
    const parsedValue = parseInt(value, 10);

    if (!value || isNaN(parsedValue) || parsedValue <= 0) {
      setQuantityError('Quantity must be a positive whole number');
      setQuantity('');
    } else {
      setQuantityError('');
      setQuantity(parsedValue);
    }
  };

  const handlePurchase = () => {
    if (!selectedAccount) {
      alert("Please select an account to proceed.");
      return;
    }
    if (quantityError || !quantity) {
      alert("Please enter a valid quantity.");
      return;
    }

    console.log(`Purchasing ${quantity} shares of ${stock.symbol} for account ${selectedAccount}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">{stock.symbol} - {stock.name}</Typography>
        <Typography>Price: ${stock.last_price}</Typography>

        <TextField
          fullWidth
          type="number"
          label="Quantity"
          value={quantity}
          onChange={handleQuantityChange}
          error={Boolean(quantityError)}
          helperText={quantityError}
          sx={{ mt: 2 }}
          inputProps={{ min: 1, step: 1 }}
        />

        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Select
            fullWidth
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            sx={{ mt: 2 }}
            displayEmpty
          >
            <MenuItem value="" disabled>Select an account</MenuItem>
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handlePurchase}
          sx={{ mt: 2 }}
          disabled={!quantity || Boolean(quantityError) || !selectedAccount}
        >
          Buy
        </Button>
      </Box>
    </Modal>
  );
}

export default PurchaseStockModal;
