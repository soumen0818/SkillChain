
const express = require('express');
const router = express.Router();
const { issueCertificate, getCertificatesByStudent } = require('../controllers/certificateController');
const { protect, isTeacher } = require('../middleware/auth');

router.route('/').post(protect, isTeacher, issueCertificate);
router.route('/my-certificates').get(protect, getCertificatesByStudent);

module.exports = router;
