import React, { createContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Simple user ID simulation (e.g., local storage or random)
    const [userId] = useState(() => {
        let id = localStorage.getItem('gym_user_id');
        if (!id) {
            id = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gym_user_id', id);
        }
        return id;
    });

    const fetchCart = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };



    const removeFromCart = async (cartItemId) => {
        console.log(`[DEBUG] removeFromCart called for item: ${cartItemId}`);
        // Optimistic Update
        const originalCart = [...cart];
        setCart(cart.filter(item => item.cart_id !== cartItemId));

        try {
            await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
            fetchCart();
        } catch (err) {
            console.error("Failed to remove from cart", err);
            setCart(originalCart); // Revert on error
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        console.log(`[DEBUG] updateQuantity called for item: ${cartItemId} with newQuantity: ${newQuantity}`);
        // Optimistic Update
        const originalCart = [...cart];
        setCart(cart.map(item =>
            item.cart_id === cartItemId ? { ...item, quantity: Math.max(0, newQuantity) } : item
        ).filter(item => item.quantity > 0)); // Remove if 0 locally

        try {
            await axios.put(`http://localhost:5000/api/cart/${cartItemId}`, { quantity: newQuantity });
            fetchCart(); // Sync with server consistency
        } catch (err) {
            console.error("Failed to update cart", err);
            setCart(originalCart); // Revert on error
        }
    };

    const clearCart = () => {
        setCart([]);
        // Backend clear handled by order
    };

    useEffect(() => {
        fetchCart();
    }, [userId]);

    // Snackbar State
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const showSuccess = (message) => {
        setSnackbar({ open: true, message });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const addToCart = async (product, silent = false) => {
        try {
            await axios.post('http://localhost:5000/api/cart', { user_id: userId, product_id: product.id });
            fetchCart();
            if (!silent) showSuccess(`${product.name} added to cart!`);
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
    };

    const addMultipleToCart = async (products) => {
        // Sequentially add for simplicity (or parallel if backend supports)
        // Since we want one notification, we pass silent=true to loops
        try {
            // Ideally backend bulk add, but loop is fine for now
            for (const p of products) {
                await addToCart(p, true);
            }
            showSuccess('Plan items successfully added to cart!');
        } catch (err) {
            console.error("Failed to add plans", err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart, userId, clearCart, addMultipleToCart }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} serverity="success" sx={{ width: '100%', bgcolor: '#00e676', color: 'white', fontWeight: 'bold' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </CartContext.Provider>
    );
};
