
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
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  courseCategory: {
    type: String,
    default: 'General',
  },
  certificateType: {
    type: String,
    enum: ['completion', 'excellence', 'mastery'],
    default: 'completion',
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },
  completionTime: {
    type: String,
  },
  skillTokensAwarded: {
    type: Number,
    default: 10,
  },
  customMessage: {
    type: String,
    default: '',
  },
  walletAddress: {
    type: String,
  },
  tokenId: {
    type: String,
  },
  transactionHash: {
    type: String,
  },
  nftTokenId: {
    type: String,
  },
  blockchainTxHash: {
    type: String,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
