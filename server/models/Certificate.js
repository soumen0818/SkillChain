
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
