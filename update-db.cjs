// Script to directly update the course in MongoDB
require('dotenv').config({ path: './server/.env' });
const { MongoClient } = require('mongodb');

async function updateCourseInDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('Error: MONGO_URI is not defined in the .env file');
        process.exit(1);
    }
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(); // Use default database
        const collection = db.collection('courses');

        // Find the course
        const courses = await collection.find({}).toArray();
        console.log('Found courses:', courses.length);

        if (courses.length > 0) {
            const courseToUpdate = courses[0];
            console.log('Updating course:', courseToUpdate.title);

            // Update the course with missing fields
            const updateResult = await collection.updateOne(
                { _id: courseToUpdate._id },
                {
                    $set: {
                        status: 'active',
                        category: 'Frontend Development',
                        level: 'Beginner',
                        duration: '6 weeks',
                        price: '0.05',
                        skillTokenReward: '100'
                    }
                }
            );

            console.log('Update result:', updateResult);
            console.log('Course updated successfully!');
        } else {
            console.log('No courses found to update');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

updateCourseInDB();
