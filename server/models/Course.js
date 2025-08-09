
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  skillTokenReward: {
    type: String,
    required: true,
  },
  prerequisites: [{
    type: String,
  }],
  learningOutcomes: [{
    type: String,
  }],
  thumbnail: {
    type: String,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused'],
    default: 'draft',
  },
  content: [
    {
      title: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'document', 'assignment'],
      },
      url: String,
      description: String,
    },
  ],
  syllabus: [{
    id: String,
    title: String,
    description: String,
    lessons: [{
      id: String,
      title: String,
      type: {
        type: String,
        enum: ['video', 'document', 'quiz', 'assignment'],
      },
      content: String,
      description: String,
    }]
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: String,
    default: '0 ETH',
  },
  skillTokens: {
    type: String,
    default: '0 SKILL',
  },
  certificates: {
    type: Number,
    default: 0,
  },
  modules: {
    type: Number,
    default: 0,
  },
  totalLessons: {
    type: Number,
    default: 0,
  },
  enrollmentTrend: {
    type: String,
    default: '+0%',
  },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
