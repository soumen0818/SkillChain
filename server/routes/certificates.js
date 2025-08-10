
const express = require('express');
const router = express.Router();
const {
    issueCertificate,
    getCertificatesByStudent,
    getCertificatesByTeacher,
    getCourseStudents,
    getCertificateById
} = require('../controllers/certificateController');
const { protect, isTeacher } = require('../middleware/auth');

// Certificate management routes
router.route('/').post(protect, isTeacher, issueCertificate);
router.route('/my-certificates').get(protect, getCertificatesByStudent);
router.route('/teacher-certificates').get(protect, isTeacher, getCertificatesByTeacher);
router.route('/course/:courseId/students').get(protect, isTeacher, getCourseStudents);
router.route('/:certificateId').get(getCertificateById);

module.exports = router;
