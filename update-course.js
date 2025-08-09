// Script to update the existing course with proper fields
async function updateCourse() {
    try {
        console.log('Updating existing course...');

        // Get existing course
        const getResponse = await fetch('http://localhost:5000/api/courses');
        const courses = await getResponse.json();

        if (courses.length === 0) {
            console.log('No courses found');
            return;
        }

        const courseToUpdate = courses[0];
        console.log('Found course:', courseToUpdate.title);

        // Update the course with missing fields
        const updateData = {
            category: courseToUpdate.category || 'Frontend Development',
            level: courseToUpdate.level || 'Beginner',
            duration: courseToUpdate.duration || '6 weeks',
            price: courseToUpdate.price || '0.05',
            skillTokenReward: courseToUpdate.skillTokenReward || '100',
            status: 'active' // Change from draft to active
        };

        console.log('Updating with data:', updateData);

        const updateResponse = await fetch(`http://localhost:5000/api/courses/${courseToUpdate._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        if (updateResponse.ok) {
            const updatedCourse = await updateResponse.json();
            console.log('Course updated successfully!');
            console.log('New status:', updatedCourse.status);
            console.log('New category:', updatedCourse.category);
            console.log('New level:', updatedCourse.level);
        } else {
            console.error('Failed to update course:', updateResponse.status);
        }

    } catch (error) {
        console.error('Error updating course:', error.message);
    }
}

updateCourse();
