const axios = require('axios');

const testSignup = async () => {
  try {
    console.log('Testing signup endpoint...');
    
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123',
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      role: 'student'
    };
    
    console.log('Sending signup request with data:', testUser);
    
    const response = await axios.post('http://localhost:5000/api/auth/signup', testUser);
    
    console.log('Signup successful:', response.data);
  } catch (error) {
    console.error('Signup failed with error:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', error.response?.data);
    console.error('Full Error:', error.message);
    
    if (error.response?.data) {
      console.error('Server Error Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

testSignup();
