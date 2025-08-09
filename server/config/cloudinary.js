const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for course thumbnails
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'skillchain/thumbnails',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto' }
        ],
    },
});

// Storage configuration for course videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'skillchain/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    },
});

// Storage configuration for lesson content (mixed files)
const lessonContentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: isVideo ? 'skillchain/lesson-videos' : 'skillchain/lesson-files',
            resource_type: isVideo ? 'video' : 'auto',
            allowed_formats: isVideo
                ? ['mp4', 'mov', 'avi', 'mkv', 'webm']
                : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx'],
        };
    },
});

// Multer instances
const thumbnailUpload = multer({
    storage: thumbnailStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for images
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for thumbnails'), false);
        }
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'), false);
        }
    },
});

const lessonContentUpload = multer({
    storage: lessonContentStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/', 'video/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));

        if (isAllowed) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    },
});

module.exports = {
    cloudinary,
    thumbnailUpload,
    videoUpload,
    lessonContentUpload,
};
