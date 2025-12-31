import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { trackingId, notificationStatus } = location.state || {};

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Box sx={{ mb: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 100, color: 'primary.main' }} />
            </Box>
            <Typography variant="h3" gutterBottom>
                Order Placed!
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
                Thank you for your purchase. Your healthy fuel is on its way.
            </Typography>

            {trackingId && (
                <Box sx={{ mt: 3, p: 3, bgcolor: '#ffffff', borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000', fontSize: '1.2rem' }}>
                        Tracking ID: <span style={{ color: '#00e676', fontSize: '1.4rem' }}>{trackingId}</span>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1, color: '#333', fontWeight: '500' }}>
                        {notificationStatus === 'sent' && "✅ WhatsApp confirmation sent!"}
                        {notificationStatus === 'simulation' && "ℹ️ WhatsApp simulated (check server logs)."}
                        {notificationStatus === 'failed' && `⚠️ WhatsApp sending failed: ${location.state?.error || 'Unknown error'}`}
                    </Typography>
                </Box>
            )}

            <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 4 }}>
                Back to Home
            </Button>
        </Container>
    );
};

export default Success;
