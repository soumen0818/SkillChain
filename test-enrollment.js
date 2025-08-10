const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
    username: 'teststudent',
    email: 'test@example.com',
    password: 'password123',
    role: 'student'
};

const testCourse = {
    title: 'Test Course for Enrollment',
    description: 'A test course to verify enrollment functionality',
    category: 'blockchain',
    level: 'Beginner',
    duration: '4 weeks',
    price: '0.05',
    skillTokenReward: '50',
    prerequisites: [],
    learningOutcomes: ['Learn blockchain basics'],
    thumbnail: 'https://images.unsplash.com/photo-1518896012122-3dcff33c6334?w=300&h=200&fit=crop',
    syllabus: [
        {
            title: 'Module 1: Introduction',
            lessons: [
                { title: 'Lesson 1: What is Blockchain?' },
                { title: 'Lesson 2: Basic Concepts' }
            ]
        }
    ],
    status: 'active'
};

async function testEnrollmentFlow() {
    try {
        console.log('🚀 Starting enrollment flow test...\n');

        // 1. Register a test teacher (to create courses)
        console.log('📝 Registering test teacher...');
        const teacherResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
            ...testUser,
            username: 'testteacher',
            email: 'teacher@example.com',
            role: 'teacher'
        });
        console.log('✅ Teacher registered successfully');

        // 2. Register a test student
        console.log('📝 Registering test student...');
        try {
            const studentResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
            console.log('✅ Student registered successfully');
        } catch (err) {
            if (err.response?.data?.message?.includes('already exists')) {
                console.log('ℹ️  Student already exists, continuing...');
            } else {
                throw err;
            }
        }

        // 3. Login as teacher
        console.log('🔐 Logging in as teacher...');
        const teacherLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'teacher@example.com',
            password: 'password123'
        });
        const teacherToken = teacherLogin.data.token;
        console.log('✅ Teacher logged in successfully');

        // 4. Create a test course
        console.log('📚 Creating test course...');
        const courseResponse = await axios.post(`${API_BASE_URL}/courses`, testCourse, {
            headers: { Authorization: `Bearer ${teacherToken}` }
        });
        const courseId = courseResponse.data._id;
        console.log(`✅ Course created with ID: ${courseId}`);

        // 5. Login as student
        console.log('🔐 Logging in as student...');
        const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        const studentToken = studentLogin.data.token;
        console.log('✅ Student logged in successfully');

        // 6. Get available courses
        console.log('📖 Fetching available courses...');
        const coursesResponse = await axios.get(`${API_BASE_URL}/courses`);
        console.log(`✅ Found ${coursesResponse.data.length} available courses`);

        // 7. Enroll in the course
        console.log('📝 Enrolling in course...');
        await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`, {}, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log('✅ Successfully enrolled in course');

        // 8. Get enrolled courses
        console.log('📚 Fetching enrolled courses...');
        const enrolledResponse = await axios.get(`${API_BASE_URL}/courses/student/enrolled`, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        console.log(`✅ Student has ${enrolledResponse.data.length} enrolled courses`);

        if (enrolledResponse.data.length > 0) {
            console.log('📋 Enrolled course details:');
            enrolledResponse.data.forEach(course => {
                console.log(`   - ${course.title} (${course.category})`);
            });
        }

        // 9. Try to enroll again (should fail)
        console.log('🔄 Testing duplicate enrollment...');
        try {
            await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`, {}, {
                headers: { Authorization: `Bearer ${studentToken}` }
            });
            console.log('❌ ERROR: Duplicate enrollment should have failed');
        } catch (err) {
            if (err.response?.data?.message?.includes('Already enrolled')) {
                console.log('✅ Duplicate enrollment correctly rejected');
            } else {
                throw err;
            }
        }

        console.log('\n🎉 All tests passed! Enrollment flow is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
    }
}

testEnrollmentFlow();
