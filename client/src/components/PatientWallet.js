import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, 
  List, ListItem, ListItemText, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AccountBalanceWallet, GetApp } from '@mui/icons-material';

function PatientWallet({ user }) {
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWallet();
  }, [user]);

  const loadWallet = async () => {
    try {
      const userId = user._id || user.id;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-wallet/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/patient-wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || user.id,
          amount: parseFloat(withdrawAmount)
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setWithdrawDialog(false);
        setWithdrawAmount('');
        loadWallet();
      } else {
        alert(data.message || 'Withdrawal failed');
      }
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalanceWallet color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">💰 My Wallet</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<GetApp />}
              onClick={() => setWithdrawDialog(true)}
              disabled={wallet.balance <= 0}
            >
              Withdraw
            </Button>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
            <Typography variant="h4" color="success.contrastText">
              ₹{wallet.balance?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2" color="success.contrastText">
              Available Balance
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
          {wallet.transactions?.length > 0 ? (
            <List>
              {wallet.transactions.slice(0, 5).map((transaction, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={transaction.description}
                    secondary={new Date(transaction.timestamp).toLocaleString()}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={`${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount}`}
                      color={transaction.type === 'credit' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">No transactions yet</Typography>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialog} onClose={() => setWithdrawDialog(false)}>
        <DialogTitle>💸 Withdraw Money</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Available Balance: ₹{wallet.balance?.toFixed(2)}
          </Typography>
          <TextField
            fullWidth
            label="Withdrawal Amount"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            inputProps={{ max: wallet.balance, min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PatientWallet;