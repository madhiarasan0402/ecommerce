import React, { useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Button, Box, Paper, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductImage } from '../utils/imageMapping';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchCart();
    }, []);

    console.log('[DEBUG] Cart Data:', cart);

    const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

    return (
        <Container maxWidth="md" sx={{ height: '100vh', overflowY: 'auto', bgcolor: '#121212', color: 'white', py: 2 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/plans')}
                sx={{ color: '#00e676', mb: 2 }}
            >
                Back to Plans
            </Button>

            {cart.length === 0 ? (
                <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
                <Paper sx={{ p: 2, bgcolor: '#1e1e1e', color: 'white' }}>
                    <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {cart.map((item) => (
                            <React.Fragment key={item.cart_id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.cart_id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={getProductImage(item.name, item.image_url)} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ minWidth: '30px', p: 0, color: 'white', borderColor: 'gray' }}
                                                    onClick={() => updateQuantity(item.cart_id, item.quantity - 1)}
                                                >
                                                    -
                                                </Button>
                                                <Typography sx={{ mx: 2, color: 'white' }}>{item.quantity}</Typography>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ minWidth: '30px', p: 0, color: 'white', borderColor: 'gray' }}
                                                    onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                        }
                                    />
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#00e676' }}>
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'gray' }}>
                                            (₹{item.price} each)
                                        </Typography>
                                    </Box>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">Total: ₹{total.toFixed(2)}</Typography>
                        <Button variant="contained" size="large" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </Box>
                </Paper>
            )}
        </Container>
    );
};

export default Cart;
