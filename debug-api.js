// Debug script to test course API

async function testCourseAPI() {
    try {
        console.log('Testing course API...');

        // Test if server is running
        const response = await fetch('http://localhost:5000/api/courses');

        if (!response.ok) {
            console.error('API not responding:', response.status, response.statusText);
            return;
        }

        const courses = await response.json();
        console.log('API Response:');
        console.log('Total courses found:', courses.length);

        courses.forEach((course, index) => {
            console.log(`\nCourse ${index + 1}:`);
            console.log('- ID:', course._id);
            console.log('- Title:', course.title);
            console.log('- Status:', course.status);
            console.log('- Category:', course.category);
            console.log('- Level:', course.level);
            console.log('- Duration:', course.duration);
            console.log('- Price:', course.price);
            console.log('- Teacher:', course.teacher ? course.teacher.username : 'No teacher info');
            console.log('- Thumbnail:', course.thumbnail);
            console.log('- Students:', course.students ? course.students.length : 0);
            console.log('- Created:', course.createdAt);
        });

    } catch (error) {
        console.error('Error testing API:', error.message);
        console.log('Make sure the server is running on port 5000');
    }
}

testCourseAPI();
