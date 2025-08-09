import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-production-url.com/api'
    : 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    const savedUser = localStorage.getItem('skillchain_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        return user.token ? `Bearer ${user.token}` : '';
    }
    return '';
};

// Upload course thumbnail
export const uploadThumbnail = async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
        console.log('Uploading thumbnail to:', `${API_BASE_URL}/upload/thumbnail`);
        const response = await axios.post(`${API_BASE_URL}/upload/thumbnail`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthToken(),
            },
        });

        return {
            url: response.data.url,
            public_id: response.data.public_id,
        };
    } catch (error: any) {
        console.error('Upload error details:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to upload thumbnail');
    }
};

// Upload course video
export const uploadVideo = async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('video', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/upload/video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthToken(),
            },
        });

        return {
            url: response.data.url,
            public_id: response.data.public_id,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to upload video');
    }
};

// Upload lesson content (video, document, image)
export const uploadLessonContent = async (file: File): Promise<{ url: string; public_id: string; type: string }> => {
    const formData = new FormData();
    formData.append('content', file);

    try {
        console.log('Uploading lesson content to:', `${API_BASE_URL}/upload/lesson-content`);
        const response = await axios.post(`${API_BASE_URL}/upload/lesson-content`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthToken(),
            },
        });

        return {
            url: response.data.url,
            public_id: response.data.public_id,
            type: response.data.type,
        };
    } catch (error: any) {
        console.error('Upload error details:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to upload lesson content');
    }
};

// Upload multiple lesson contents
export const uploadMultipleLessonContents = async (files: File[]): Promise<Array<{ url: string; public_id: string; type: string; originalName: string }>> => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('contents', file);
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/upload/lesson-content/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': getAuthToken(),
            },
        });

        return response.data.files;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
};

// Helper function to check file type
export const getFileType = (file: File): 'image' | 'video' | 'document' | 'unknown' => {
    const mimeType = file.type.toLowerCase();

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) return 'document';

    return 'unknown';
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to validate file
export const validateFile = (file: File, type: 'thumbnail' | 'video' | 'content'): { valid: boolean; error?: string } => {
    const maxSizes = {
        thumbnail: 5 * 1024 * 1024, // 5MB
        video: 100 * 1024 * 1024,   // 100MB
        content: 100 * 1024 * 1024  // 100MB
    };

    const allowedTypes = {
        thumbnail: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        video: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'],
        content: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm',
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    // Check file size
    if (file.size > maxSizes[type]) {
        return {
            valid: false,
            error: `File size exceeds ${formatFileSize(maxSizes[type])} limit`
        };
    }

    // Check file type
    if (!allowedTypes[type].includes(file.type.toLowerCase())) {
        return {
            valid: false,
            error: `File type ${file.type} is not allowed for ${type}`
        };
    }

    return { valid: true };
};
