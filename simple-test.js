// Simple manual test to create a test scenario
const API_BASE_URL = 'http://localhost:5000/api';

async function setupTestData() {
    try {
        console.log('Setting up test data...');

        // Test with simple fetch
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const courses = await response.json();
            console.log('API is working! Found courses:', courses.length);
        } else {
            console.log('API response status:', response.status);
            const errorText = await response.text();
            console.log('Error:', errorText);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

setupTestData();
