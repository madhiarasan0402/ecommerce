import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

// Category Data
const categories = [
    { name: 'Fresh Fruits', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop', filter: 'Fresh Fruits' },
    { name: 'Dry Fruits', img: '/dry_fruits_selection.png', filter: 'Dry Fruits' },
    { name: 'Seeds', img: '/pumpkin_seeds_selection.png', filter: 'Seeds' },
    { name: 'Nuts', img: '/mixed_nuts_selection.png', filter: 'Nuts' },
    { name: 'Protein Snacks', img: '/protein_bar_selection.png', filter: 'Snacks' }
];

const Home = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (filterKeyword) => {
        const keyword = (filterKeyword || '').trim().toLowerCase();
        // Navigate to the new category page
        navigate(`/category/${encodeURIComponent(keyword)}`);
    };

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden', bgcolor: '#121212', color: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section - Top Half */}
            <Box sx={{
                flex: 1, // Takes 50% of height
                width: '100%',
                backgroundImage: 'url("/hero_gym_workout.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)' }} />
                <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
                    <Typography variant="h2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                        Fuel Your Gains
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 2, mb: 4, opacity: 0.9 }}>
                        Premium selection of Gym Nutrition & Supplements
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={() => navigate('/plans')}
                        sx={{ px: 5, py: 1.5, fontSize: '1.2rem', borderRadius: '50px', fontWeight: 'bold' }}
                    >
                        Shop Now
                    </Button>
                </Box>
            </Box>

            {/* Features Categories - Bottom Half */}
            <Box sx={{
                flex: 1, // Takes 50% of height
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 0,
                width: '100%'
            }}>
                {categories.map((cat, index) => (
                    <Box
                        key={index}
                        onClick={() => handleCategoryClick(cat.filter)}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            '&:hover .cat-img': { transform: 'scale(1.1)' },
                            '&:hover': { bgcolor: '#111' }
                        }}
                    >
                        {/* Image Section */}
                        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative', width: '100%' }}>
                            <Box
                                className="cat-img"
                                component="img"
                                src={cat.img}
                                alt={cat.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                            />
                        </Box>

                        {/* Label Section */}
                        <Box sx={{
                            py: 2,
                            bgcolor: '#000',
                            textAlign: 'center',
                            borderTop: '1px solid #333',
                            zIndex: 2,
                            width: '100%'
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00e676', textTransform: 'uppercase', letterSpacing: 1 }}>
                                {cat.name}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Home;