const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'emoji', 'file'],
    default: 'text'
  },
  emoji: {
    type: String,
    default: null
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  reactions: [{
    emoji: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

const discussionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: {
    type: String,
    default: null // If null, it's general course discussion
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['general', 'question', 'announcement'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [messageSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add message to discussion and update counters
discussionSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.messageCount = this.messages.length;
  this.lastActivity = new Date();
  
  // Add user to participants if not already there
  const userId = messageData.user || messageData.createdBy;
  if (userId && !this.participants.some(p => p.user.toString() === userId.toString())) {
    this.participants.push({
      user: userId,
      joinedAt: new Date(),
      lastSeen: new Date()
    });
  }
  
  return this.save();
};

// Update last seen for a user
discussionSchema.methods.updateLastSeen = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.lastSeen = new Date();
  } else {
    this.participants.push({
      user: userId,
      joinedAt: new Date(),
      lastSeen: new Date()
    });
  }
  return this.save();
};

// Indexes for better performance
discussionSchema.index({ courseId: 1, isActive: 1, lastActivity: -1 });
discussionSchema.index({ createdBy: 1 });
discussionSchema.index({ 'participants.user': 1 });

module.exports = mongoose.model('Discussion', discussionSchema);
