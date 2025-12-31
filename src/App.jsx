import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryProducts from './pages/CategoryProducts';
import Plans from './pages/Plans';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import { CartProvider, CartContext } from './context/CartContext';
import { Box } from '@mui/material';

const MainLayout = () => {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar cartCount={cartCount} />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryProducts />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
};

export default App;
