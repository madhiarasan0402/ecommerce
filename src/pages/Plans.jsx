import React, { useState, useEffect, useContext } from 'react';
import { Grid, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Box, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Alert } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { getProductImage } from '../utils/imageMapping';

// PlanCard Component defined outside to prevent re-creation on render
const PlanCard = ({ title, items = [], price, planType, onSwap, onAdd }) => (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e', boxShadow: 3, borderRadius: 0 }}>
        <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                <Box>
                    <Typography variant="h4" component="div" sx={{ color: '#00e676', fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        ₹{price} / month
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => onAdd(items)}
                    sx={{ color: 'black', fontWeight: 'bold', height: 'fit-content', px: 4 }}
                >
                    Buy Plan
                </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
                {items && items.length > 0 ? (
                    items.map((item, idx) => (
                        <Paper key={idx} elevation={4} sx={{ p: 2, bgcolor: '#2c2c2c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                                <Avatar src={getProductImage(item.name, item.image_url)} alt={item.name} sx={{ width: 56, height: 56, mr: 2 }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{item.name}</Typography>
                                    <Typography variant="body2" sx={{ color: '#00e676', fontWeight: 'bold' }}>₹{item.price}</Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={() => onSwap(planType, idx)}>
                                <SwapHorizIcon sx={{ color: '#00e676', fontSize: 28 }} />
                            </IconButton>
                        </Paper>
                    ))
                ) : (
                    <Typography sx={{ p: 2, color: 'gray' }}>No items in this plan.</Typography>
                )}
            </Box>
        </CardContent>
    </Card>
);

const Plans = () => {
    const [products, setProducts] = useState([]);
    const [planA, setPlanA] = useState([]); // 5 items
    const [planB, setPlanB] = useState([]); // 10 items
    const [pool, setPool] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Swap Logic
    const [openSwap, setOpenSwap] = useState(false);
    const [swapTarget, setSwapTarget] = useState({ plan: null, index: null });

    const { addMultipleToCart } = useContext(CartContext);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/api/products')
            .then(res => {
                const all = res.data;
                if (!Array.isArray(all)) {
                    throw new Error("Invalid data format received from server");
                }

                // Simple distribution logic
                const a = all.slice(0, 5);
                const b = all.slice(5, 15);

                // If not enough items, fill B with duplicates or cycle
                if (b.length < 10 && all.length > 0) {
                    let needed = 10 - b.length;
                    let i = 0;
                    while (needed > 0) {
                        b.push(all[i % all.length]);
                        i++;
                        needed--;
                    }
                }

                setProducts(all);
                setPlanA(a);
                setPlanB(b);
                setPool(all);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch plans:", err);
                setError("Failed to load plans. Please try again later.");
                setLoading(false);
            });
    }, []);

    const handleSwapClick = (plan, index) => {
        setSwapTarget({ plan, index });
        setOpenSwap(true);
    };

    const performSwap = (newItem) => {
        if (swapTarget.plan === 'A') {
            const newPlan = [...planA];
            newPlan[swapTarget.index] = newItem;
            setPlanA(newPlan);
        } else {
            const newPlan = [...planB];
            newPlan[swapTarget.index] = newItem;
            setPlanB(newPlan);
        }
        setOpenSwap(false);
    };

    const addPlanToCart = (items) => {
        addMultipleToCart(items);
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#121212', color: 'white' }}>
                <CircularProgress color="success" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', p: 4, bgcolor: '#121212', color: 'white' }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', p: 0, bgcolor: '#121212', color: 'white', overflowX: 'hidden' }}>
            <Box sx={{ width: '100%', mb: 1 }}>
                <PlanCard
                    title="Plan A (Starters)"
                    items={planA}
                    price={2000}
                    planType="A"
                    onSwap={handleSwapClick}
                    onAdd={addPlanToCart}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <PlanCard
                    title="Plan B (Pro)"
                    items={planB}
                    price={3500}
                    planType="B"
                    onSwap={handleSwapClick}
                    onAdd={addPlanToCart}
                />
            </Box>

            {/* Swap Dialog */}
            <Dialog
                open={openSwap}
                onClose={() => setOpenSwap(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { bgcolor: '#1e1e1e', color: 'white' }
                }}
            >
                <DialogTitle sx={{ bgcolor: '#000', color: '#00e676' }}>Swap Item</DialogTitle>
                <DialogContent>
                    <List>
                        {pool.map((product) => (
                            <ListItem
                                button
                                key={product.id}
                                onClick={() => performSwap(product)}
                                sx={{
                                    '&:hover': { bgcolor: '#333' },
                                    borderBottom: '1px solid #333'
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={getProductImage(product.name, product.image_url)} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography color="white">{product.name}</Typography>}
                                    secondary={<Typography color="gray" variant="caption">₹{product.price}</Typography>}
                                />
                                <Chip
                                    label={product.category}
                                    size="small"
                                    sx={{ bgcolor: '#00e676', color: 'black', fontWeight: 'bold' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Plans;
