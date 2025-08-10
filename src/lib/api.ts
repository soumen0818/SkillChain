const API_BASE_URL = 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => {
    const user = localStorage.getItem('skillchain_user');
    if (user) {
        const userData = JSON.parse(user);
        return userData.token;
    }
    return null;
};

// Create headers with auth token
const createHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Course API functions
export const courseAPI = {
    // Create a new course
    create: async (courseData: any) => {
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(courseData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create course');
        }

        return response.json();
    },

    // Get all courses (published only)
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/courses`);

        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        return response.json();
    },

    // Get all courses including drafts (for admin/teacher)
    getAllIncludingDrafts: async () => {
        const response = await fetch(`${API_BASE_URL}/courses/all`, {
            headers: createHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch all courses');
        }

        return response.json();
    },

    // Get course by ID
    getById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch course');
        }

        return response.json();
    },

    // Update course
    update: async (id: string, updates: any) => {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update course');
        }

        return response.json();
    },

    // Delete course
    delete: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE',
            headers: createHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete course');
        }

        return response.json();
    },

    // Get teacher's courses
    getTeacherCourses: async () => {
        console.log('Making request to teacher courses:', `${API_BASE_URL}/courses/teacher/courses`);
        const response = await fetch(`${API_BASE_URL}/courses/teacher/courses`, {
            headers: createHeaders(),
        });

        console.log('Teacher courses response status:', response.status);

        if (!response.ok) {
            throw new Error('Failed to fetch teacher courses');
        }

        return response.json();
    },

    // Enroll in course
    enroll: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/courses/${id}/enroll`, {
            method: 'POST',
            headers: createHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to enroll in course');
        }

        return response.json();
    },

    // Get enrolled courses for student
    getEnrolledCourses: async () => {
        const response = await fetch(`${API_BASE_URL}/courses/student/enrolled`, {
            headers: createHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch enrolled courses');
        }

        return response.json();
    },

    // Get teacher analytics
    getTeacherAnalytics: async () => {
        console.log('Making request to:', `${API_BASE_URL}/courses/teacher/analytics`);
        console.log('Headers:', createHeaders());

        const response = await fetch(`${API_BASE_URL}/courses/teacher/analytics`, {
            headers: createHeaders(),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const error = await response.text();
            console.error('API Error Response:', error);
            throw new Error(error || 'Failed to fetch teacher analytics');
        }

        const data = await response.json();
        console.log('Parsed response data:', data);
        return data;
    },

    // Get course-specific analytics
    getCourseAnalytics: async (courseId: string) => {
        console.log('Making request to course analytics:', `${API_BASE_URL}/courses/${courseId}/analytics`);

        const response = await fetch(`${API_BASE_URL}/courses/${courseId}/analytics`, {
            headers: createHeaders(),
        });

        console.log('Course analytics response status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('Course Analytics API Error:', error);
            throw new Error(error || 'Failed to fetch course analytics');
        }

        const data = await response.json();
        console.log('Course analytics data:', data);
        return data;
    },
};

// Auth API functions
export const authAPI = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    register: async (userData: any) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },
};

// Certificate API functions
export const certificateAPI = {
    // Get students for a specific course (for teachers)
    getCourseStudents: async (courseId: string) => {
        const response = await fetch(`${API_BASE_URL}/certificates/course/${courseId}/students`, {
            headers: createHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch course students');
        }

        return response.json();
    },

    // Issue certificate to a student
    issueCertificate: async (certificateData: {
        courseId: string;
        studentId: string;
        certificateType?: 'completion' | 'excellence' | 'mastery';
        grade?: number;
        completionTime?: string;
        customMessage?: string;
        skillTokensAwarded?: number;
    }) => {
        const response = await fetch(`${API_BASE_URL}/certificates`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(certificateData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to issue certificate');
        }

        return response.json();
    },

    // Get certificates for the current student
    getStudentCertificates: async () => {
        const response = await fetch(`${API_BASE_URL}/certificates/my-certificates`, {
            headers: createHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch certificates');
        }

        return response.json();
    },

    // Get certificates issued by the current teacher
    getTeacherCertificates: async () => {
        const response = await fetch(`${API_BASE_URL}/certificates/teacher-certificates`, {
            headers: createHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher certificates');
        }

        return response.json();
    },

    // Get certificate by ID (for verification)
    getCertificateById: async (certificateId: string) => {
        const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch certificate');
        }

        return response.json();
    },
};
