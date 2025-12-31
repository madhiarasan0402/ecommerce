import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Container, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="sticky" color="default" sx={{ bgcolor: '#1e1e1e', boxShadow: 3 }}>
            <Toolbar>
                <FitnessCenterIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        flexGrow: 1
                    }}
                >
                    GYM FUEL
                </Typography>

                <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
                    <Button component={Link} to="/" color="inherit">Home</Button>
                    <Button component={Link} to="/plans" color="inherit">Plans</Button>
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
