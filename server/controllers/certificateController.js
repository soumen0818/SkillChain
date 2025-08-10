
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');

// Get students enrolled in a specific course
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user._id;

    // Verify the course belongs to the teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    // Get all students enrolled in this course
    const students = await User.find({
      _id: { $in: course.students },
      role: 'student'
    }).select('_id username email name walletAddress createdAt');

    // Get certificates already issued for this course
    const certificates = await Certificate.find({ course: courseId });
    const certificateMap = {};
    certificates.forEach(cert => {
      certificateMap[cert.student.toString()] = cert;
    });

    // Add certificate status to each student
    const studentsWithProgress = students.map(student => {
      const certificate = certificateMap[student._id.toString()];
      return {
        id: student._id,
        name: student.name || student.username,
        email: student.email,
        walletAddress: student.walletAddress || '',
        joinDate: student.createdAt,
        progress: 100, // Assume completed since they're eligible for certificates
        grade: Math.floor(Math.random() * 20) + 80, // Random grade 80-100 for demo
        certificateIssued: !!certificate,
        certificateId: certificate?._id,
        certificateType: certificate?.certificateType,
        issueDate: certificate?.issueDate
      };
    });

    res.json({
      course: {
        id: course._id,
        title: course.title,
        category: course.category
      },
      students: studentsWithProgress
    });
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ message: error.message });
  }
};

// Issue certificate to a student
const issueCertificate = async (req, res) => {
  try {
    const {
      courseId,
      studentId,
      certificateType = 'completion',
      grade,
      completionTime,
      customMessage = '',
      skillTokensAwarded = 10
    } = req.body;

    const teacherId = req.user._id;

    // Verify the course belongs to the teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }

    // Verify the student is enrolled in the course
    const student = await User.findById(studentId);
    if (!student || !course.students.includes(studentId)) {
      return res.status(404).json({ message: 'Student not found or not enrolled in this course' });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      course: courseId,
      student: studentId
    });

    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already issued for this student' });
    }

    // Generate mock blockchain data for demo
    const mockTokenId = `NFT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Create the certificate
    const certificate = new Certificate({
      course: courseId,
      student: studentId,
      studentName: student.name || student.username,
      studentEmail: student.email,
      courseName: course.title,
      courseCategory: course.category || 'General',
      certificateType,
      grade: grade || Math.floor(Math.random() * 20) + 80,
      completionTime: completionTime || `${Math.floor(Math.random() * 20) + 10} hours`,
      skillTokensAwarded,
      customMessage,
      walletAddress: student.walletAddress || '',
      tokenId: mockTokenId,
      transactionHash: mockTxHash,
      nftTokenId: mockTokenId,
      blockchainTxHash: mockTxHash,
      issuedBy: teacherId,
      issueDate: new Date()
    });

    const createdCertificate = await certificate.save();

    // Update student's skill tokens (if field exists)
    if (student.skillTokens !== undefined) {
      student.skillTokens = (student.skillTokens || 0) + skillTokensAwarded;
      await student.save();
    }

    // Populate the certificate with course and student details
    const populatedCertificate = await Certificate.findById(createdCertificate._id)
      .populate('course', 'title category')
      .populate('student', 'username email name');

    res.status(201).json({
      message: 'Certificate issued successfully',
      certificate: populatedCertificate
    });
  } catch (error) {
    console.error('Error issuing certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get certificates by student (for student dashboard)
const getCertificatesByStudent = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title category description thumbnail')
      .populate('issuedBy', 'username email name')
      .sort({ issueDate: -1 });

    res.json(certificates);
  } catch (error) {
    console.error('Error fetching student certificates:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get certificates issued by teacher
const getCertificatesByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get all courses taught by this teacher
    const courses = await Course.find({ teacher: teacherId }).select('_id');
    const courseIds = courses.map(course => course._id);

    // Get all certificates for these courses
    const certificates = await Certificate.find({ course: { $in: courseIds } })
      .populate('course', 'title category')
      .populate('student', 'username email name')
      .sort({ issueDate: -1 });

    res.json(certificates);
  } catch (error) {
    console.error('Error fetching teacher certificates:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get certificate by ID (for verification)
const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findById(certificateId)
      .populate('course', 'title category description')
      .populate('student', 'username email name')
      .populate('issuedBy', 'username email name');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  issueCertificate,
  getCertificatesByStudent,
  getCertificatesByTeacher,
  getCourseStudents,
  getCertificateById
};
