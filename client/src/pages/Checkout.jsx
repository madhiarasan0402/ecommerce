import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Grid, Paper, Typography, Box, Card, CardContent, CardActionArea, Dialog, DialogContent, Fade, IconButton, Snackbar, Alert } from '@mui/material';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const Checkout = () => {
    const { cart, userId, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

    const [step, setStep] = useState(1);
    const [details, setDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [openScanner, setOpenScanner] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handlePaymentSelect = (methodId) => {
        setPaymentMethod(methodId);
        if (methodId !== 'COD') {
            setOpenScanner(true);
        }
    };

    const handleCloseScanner = () => {
        setOpenScanner(false);
    };

    const handleNext = async () => {
        if (details.name.trim() && details.email.trim() && details.phone.trim() && details.address.trim()) {
            // Trigger SMS
            try {
                await axios.post('http://localhost:5000/api/send-sms', {
                    to: details.phone,
                    message: `Hi ${details.name}, your delivery details are verified. Proceeding to payment.`
                });
                console.log('SMS Sent successfully');
            } catch (err) {
                console.error("Failed to send sms", err);
            }
            setStep(2);
        } else {
            setSnackbarMessage("Fill the details");
            setOpenSnackbar(true);
        }
    };

    const handleSubmit = async () => {
        if (!paymentMethod) {
            setSnackbarMessage('Please select a payment method.');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/orders', {
                customer_name: details.name,
                email: details.email,
                phone: details.phone,
                address: details.address,
                payment_method: paymentMethod,
                total_amount: total,
                items: cart,
                user_id: userId
            });
            clearCart();
            navigate('/success', { state: response.data });
        } catch (err) {
            console.error(err);
            setSnackbarMessage('Order failed. Please try again.');
            setOpenSnackbar(true);
        }
    };

    if (cart.length === 0) return (
        <Container sx={{ mt: 10, textAlign: 'center', color: 'white' }}>
            <Typography variant="h4">Your cart is empty.</Typography>
            <Button variant="contained" sx={{ mt: 2, bgcolor: '#00e676', color: 'black' }} onClick={() => navigate('/')}>Shop Now</Button>
        </Container>
    );

    const paymentOptions = [
        { id: 'GPay', name: 'Google Pay', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png' },
        { id: 'PhonePe', name: 'PhonePe', img: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png' },
        { id: 'UPI', name: 'UPI', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png' },
        { id: 'COD', name: 'Cash on Delivery', img: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png' }
    ];

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#121212', color: 'white', py: 2 }}>
            <Container maxWidth="md">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')} sx={{ color: '#00e676', mb: 2 }}>
                    Back to Cart
                </Button>

                <Paper sx={{ p: 4, bgcolor: '#1e1e1e', color: 'white', borderRadius: 2 }}>
                    {step === 1 ? (
                        /* Step 1: Delivery Details */
                        <Box>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, borderBottom: '1px solid #333', pb: 1 }}>
                                1. Delivery Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    required fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={details.name}
                                    onChange={handleChange}
                                    InputLabelProps={{ style: { color: '#aaa' } }}
                                    InputProps={{ style: { color: 'white', borderColor: '#444' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#00e676' } }
                                    }}
                                />
                                <TextField
                                    required fullWidth
                                    label="Email Address (separate multiple with commas)"
                                    name="email"
                                    type="email"
                                    value={details.email}
                                    onChange={handleChange}
                                    InputLabelProps={{ style: { color: '#aaa' } }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        endAdornment: null,
                                        inputProps: { multiple: true }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#00e676' } }
                                    }}
                                    helperText="e.g. user@example.com, friend@example.com"
                                    FormHelperTextProps={{ style: { color: '#777' } }}
                                />
                                <TextField
                                    required fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={details.phone}
                                    onChange={handleChange}
                                    InputLabelProps={{ style: { color: '#aaa' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#00e676' } }
                                    }}
                                />
                                <TextField
                                    required fullWidth multiline rows={4}
                                    label="Delivery Address"
                                    name="address"
                                    value={details.address}
                                    onChange={handleChange}
                                    InputLabelProps={{ style: { color: '#aaa' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' }, '&:hover fieldset': { borderColor: '#00e676' } }
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleNext}
                                    sx={{
                                        bgcolor: '#00e676',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        '&:hover': { bgcolor: '#00c853' }
                                    }}
                                >
                                    Proceed to Payment
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        /* Step 2: Payment Method */
                        <Box>
                            <Button startIcon={<ArrowBackIcon />} onClick={() => setStep(1)} sx={{ color: '#aaa', mb: 2 }}>
                                Back to Details
                            </Button>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, borderBottom: '1px solid #333', pb: 1 }}>
                                2. Select Payment Method
                            </Typography>

                            <Grid container spacing={2}>
                                {paymentOptions.map((option) => (
                                    <Grid item xs={12} sm={6} key={option.id}>
                                        <Card
                                            sx={{
                                                bgcolor: paymentMethod === option.id ? 'rgba(0, 230, 118, 0.1)' : '#2c2c2c',
                                                border: paymentMethod === option.id ? '2px solid #00e676' : '1px solid #333',
                                                color: 'white'
                                            }}
                                        >
                                            <CardActionArea onClick={() => handlePaymentSelect(option.id)} sx={{ p: 2, height: '100%' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, mb: 1 }}>
                                                    <img src={option.img} alt={option.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                                </Box>
                                                <Typography variant="h6" align="center" sx={{ fontSize: '1rem' }}>
                                                    {option.name}
                                                </Typography>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ mt: 4, p: 2, bgcolor: '#2c2c2c', borderRadius: 1 }}>
                                <Typography variant="h6">Total Amount: <span style={{ color: '#00e676' }}>₹{total.toFixed(2)}</span></Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                                disabled={!paymentMethod}
                                sx={{
                                    bgcolor: '#00e676',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    mt: 3,
                                    '&:hover': { bgcolor: '#00c853' },
                                    '&:disabled': { bgcolor: '#333', color: '#666' }
                                }}
                            >
                                {paymentMethod === 'COD' ? 'Place Order' : 'Proceed with Selected Method'}
                            </Button>
                        </Box>
                    )}
                </Paper>

                {/* Scanner Dialog */}
                <Dialog
                    open={openScanner}
                    onClose={handleCloseScanner}
                    PaperProps={{
                        sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: 2, maxWidth: 400, width: '100%' }
                    }}
                >
                    <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                        <IconButton onClick={handleCloseScanner} sx={{ color: '#aaa' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent sx={{ textAlign: 'center', p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#00e676', fontWeight: 'bold' }}>
                            Scan to Pay
                        </Typography>
                        <Box sx={{
                            bgcolor: 'white',
                            p: 2,
                            borderRadius: 2,
                            display: 'inline-block',
                            mb: 3,
                            border: '4px solid #00e676'
                        }}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shop@upi&pn=GymFuel&am=${total}&cu=INR`}
                                alt="Payment QR"
                                style={{ display: 'block' }}
                            />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Paying: <span style={{ color: '#00e676' }}>₹{total.toFixed(2)}</span>
                        </Typography>
                        <Typography variant="body2" color="#aaa" gutterBottom>
                            via {paymentOptions.find(p => p.id === paymentMethod)?.name}
                        </Typography>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                            sx={{
                                mt: 3,
                                bgcolor: '#00e676',
                                color: 'black',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#00c853' }
                            }}
                        >
                            Confirm Payment & Place Order
                        </Button>
                    </DialogContent>
                </Dialog>
            </Container>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="error"
                    sx={{ width: '100%', bgcolor: '#d32f2f', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box >
    );
};

export default Checkout;
