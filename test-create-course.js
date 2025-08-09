import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Test function to create a sample course directly
async function createTestCourse() {
    try {
        // First, let's test creating a user (you'll need to replace with actual auth)
        console.log('Creating a test course...');

        const courseData = {
            title: 'Test Blockchain Course',
            description: 'A comprehensive test course about blockchain technology',
            category: 'Blockchain Development',
            level: 'Beginner',
            duration: '4 weeks',
            price: '0.05',
            skillTokenReward: '50',
            prerequisites: ['Basic programming knowledge'],
            learningOutcomes: ['Understand blockchain basics', 'Build simple DApps'],
            thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=300&h=200&fit=crop',
            syllabus: [
                {
                    id: 'module_1',
                    title: 'Introduction to Blockchain',
                    description: 'Learn blockchain fundamentals',
                    lessons: [
                        {
                            id: 'lesson_1',
                            title: 'What is Blockchain?',
                            type: 'video',
                            content: 'video_url_here',
                            description: 'Introduction to blockchain concepts'
                        }
                    ]
                }
            ],
            status: 'active'
        };

        // Note: This would normally require authentication
        // For testing, you might need to create a user first and get a token
        console.log('Course data:', courseData);

        // Try to get existing courses first
        const coursesResponse = await axios.get(`${API_BASE_URL}/courses`);
        console.log('Current courses:', coursesResponse.data);

        console.log('Test course data prepared - you would need authentication to actually create it');

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run the test
createTestCourse();
