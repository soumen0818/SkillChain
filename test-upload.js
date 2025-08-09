// Test script to verify upload endpoints
async function testUploadEndpoints() {
    try {
        console.log('Testing upload endpoints...');

        // Test the test endpoint
        const testResponse = await fetch('http://localhost:5000/api/upload/test', {
            method: 'POST'
        });

        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('✅ Test endpoint working:', testData.message);
        } else {
            console.error('❌ Test endpoint failed:', testResponse.status);
        }

        // Test thumbnail endpoint
        const thumbnailResponse = await fetch('http://localhost:5000/api/upload/thumbnail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (thumbnailResponse.ok) {
            const thumbnailData = await thumbnailResponse.json();
            console.log('✅ Thumbnail endpoint working:', thumbnailData.message);
            console.log('   URL:', thumbnailData.url);
        } else {
            console.error('❌ Thumbnail endpoint failed:', thumbnailResponse.status);
        }

        // Test lesson content endpoint
        const contentResponse = await fetch('http://localhost:5000/api/upload/lesson-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            console.log('✅ Lesson content endpoint working:', contentData.message);
            console.log('   URL:', contentData.url);
        } else {
            console.error('❌ Lesson content endpoint failed:', contentResponse.status);
        }

    } catch (error) {
        console.error('Error testing endpoints:', error.message);
    }
}

testUploadEndpoints();
