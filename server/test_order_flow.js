const axios = require('axios');

async function testOrder() {
    try {
        console.log('Sending test order...');
        const response = await axios.post('http://localhost:5000/api/orders', {
            customer_name: 'Debug User',
            email: 'madhiarasan0402@gmail.com', // Should send email to this address
            phone: '9999999999',
            address: '123 Test St',
            payment_method: 'COD',
            total_amount: 100,
            items: [],
            user_id: 'test_user_id'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testOrder();
