
const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, enrollCourse } = require('../controllers/courseController');
const { protect, isTeacher } = require('../middleware/auth');

router.route('/').get(getCourses).post(protect, isTeacher, createCourse);
router.route('/:id').get(getCourseById);
router.route('/:id/enroll').post(protect, enrollCourse);


module.exports = router;
