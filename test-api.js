import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Test function to create a sample course
async function testCourseCreation() {
    try {
        // First, let's test if we can get courses without authentication
        console.log('Testing GET /api/courses...');
        const coursesResponse = await axios.get(`${API_BASE_URL}/courses`);
        console.log('Courses response:', coursesResponse.data);

        // Test creating a user and course (you'll need to implement this with actual auth)
        console.log('API endpoints are accessible');
    } catch (error) {
        console.error('API test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Test the connection
testCourseCreation();
