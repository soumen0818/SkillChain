
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
    deleteCourse
} = require('../controllers/courseController');
const { protect, isTeacher } = require('../middleware/auth');

// Public routes
router.route('/').get(getCourses);
router.route('/all').get(getAllCourses);
router.route('/:id').get(getCourseById);

// Protected routes
router.route('/').post(protect, isTeacher, createCourse);
router.route('/:id').put(protect, isTeacher, updateCourse);
router.route('/:id').delete(protect, isTeacher, deleteCourse);
router.route('/:id/enroll').post(protect, enrollCourse);
router.route('/teacher/courses').get(protect, isTeacher, getTeacherCourses);

module.exports = router;
