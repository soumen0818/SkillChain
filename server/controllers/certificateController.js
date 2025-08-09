
const Certificate = require('../models/Certificate');

const issueCertificate = async (req, res) => {
  const { courseId, studentId, tokenId, transactionHash } = req.body;
  try {
    const certificate = new Certificate({
      course: courseId,
      student: studentId,
      tokenId,
      transactionHash,
    });
    const createdCertificate = await certificate.save();
    res.status(201).json(createdCertificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCertificatesByStudent = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id }).populate('course', 'title');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { issueCertificate, getCertificatesByStudent };
