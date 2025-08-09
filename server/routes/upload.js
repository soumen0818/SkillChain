const express = require('express');
const router = express.Router();
const { thumbnailUpload, lessonContentUpload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

console.log('Upload routes loaded');

// Simple test route to check if upload routes are working
router.post('/test', (req, res) => {
    console.log('Test route called');
    res.json({ message: 'Upload routes are working' });
});

router.get('/test', (req, res) => {
    console.log('Test GET route called');
    res.json({ message: 'Upload routes are working - GET' });
});

// Thumbnail upload route
router.post('/thumbnail', protect, thumbnailUpload.single('thumbnail'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({
            message: 'Thumbnail uploaded successfully',
            url: req.file.path,
            public_id: req.file.filename
        });
    } catch (error) {
        console.error('Thumbnail upload error:', error);
        res.status(500).json({ message: 'Failed to upload thumbnail', error: error.message });
    }
});

// Lesson content upload route
router.post('/lesson-content', protect, lessonContentUpload.single('content'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({
            message: 'Content uploaded successfully',
            url: req.file.path,
            public_id: req.file.filename,
            type: req.file.mimetype.split('/')[0] // 'image', 'video', 'application'
        });
    } catch (error) {
        console.error('Content upload error:', error);
        res.status(500).json({ message: 'Failed to upload content', error: error.message });
    }
});

module.exports = router;
