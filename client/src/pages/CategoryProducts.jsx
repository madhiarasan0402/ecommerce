import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { getProductImage } from '../utils/imageMapping';
import { CartContext } from '../context/CartContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CategoryProducts = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => {
                const keyword = (category || '').trim().toLowerCase();
                const filtered = res.data.filter(p => {
                    const cat = (p.category || '').trim().toLowerCase();
                    const name = (p.name || '').trim().toLowerCase();
                    // Some basic mapping if category names don't match exactly with basic strings, 
                    // but Home.jsx used 'filter' property which matched p.category often
                    // We'll trust the parameter passed in is the filter keyword.
                    return cat.includes(keyword) || name.includes(keyword);
                });
                setProducts(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load products", err);
                setLoading(false);
            });
    }, [category]);

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#121212',
            color: 'white',
            p: 2
        }}>
            <style>
                {`
                    body::-webkit-scrollbar {
                        display: none;
                    }
                    body {
                        -ms-overflow-style: none; /* IE and Edge */
                        scrollbar-width: none; /* Firefox */
                    }
                `}
            </style>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ color: '#00e676', mb: 3 }}
            >
                Back to Categories
            </Button>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, textTransform: 'capitalize', color: '#00e676' }}>
                {category} Selection
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Grid container spacing={2}>
                    {products.length > 0 ? (
                        products.map((item) => (
                            <Grid item key={item.id} xs={12} sm={6} md={4} lg={2.4}>
                                <Paper sx={{
                                    bgcolor: '#1e1e1e',
                                    color: 'white',
                                    overflow: 'hidden',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-5px)' }
                                }}>
                                    <Box
                                        component="img"
                                        src={getProductImage(item.name, item.image_url)}
                                        alt={item.name}
                                        sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                                    />
                                    <Box p={2} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                                        <Typography variant="subtitle1" color="#00e676" sx={{ fontWeight: 'bold', mt: 1 }}>₹{item.price}</Typography>
                                        <Typography variant="body2" color="#aaa" sx={{ mt: 1, flexGrow: 1 }}>{item.description}</Typography>

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                mt: 2,
                                                color: '#00e676',
                                                borderColor: '#00e676',
                                                '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.1)', borderColor: '#00e676' }
                                            }}
                                            onClick={() => addToCart(item, false)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                            <Typography variant="h6">No items found for this category.</Typography>
                        </Box>
                    )}
                </Grid>
            )}
        </Box>
    );
};

export default CategoryProducts;
