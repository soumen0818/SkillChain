
const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getAllCourses,
    getCourseById,
    updateCourse,
    getTeacherCourses,
    enrollCourse,
    deleteCourse,
    getEnrolledCourses,
    getTeacherAnalytics,
    getCourseAnalytics
} = require('../controllers/courseController');
const { protect, isTeacher } = require('../middleware/auth');

// Public routes
router.route('/').get(getCourses);
router.route('/all').get(getAllCourses);

// Protected routes - specific routes first
router.route('/teacher/courses').get(protect, isTeacher, getTeacherCourses);
router.route('/teacher/analytics').get(protect, isTeacher, getTeacherAnalytics);
router.route('/student/enrolled').get(protect, getEnrolledCourses);
router.route('/:id/analytics').get(protect, isTeacher, getCourseAnalytics);

// Dynamic routes last
router.route('/:id').get(getCourseById);
router.route('/').post(protect, isTeacher, createCourse);
router.route('/:id').put(protect, isTeacher, updateCourse);
router.route('/:id').delete(protect, isTeacher, deleteCourse);
router.route('/:id/enroll').post(protect, enrollCourse);

module.exports = router;
