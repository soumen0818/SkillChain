const express = require('express');
const router = express.Router();
const {
  getCourseDiscussions,
  getDiscussion,
  createDiscussion,
  addMessage,
  addReaction,
  deleteMessage
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

// Get all discussions for a course
router.get('/course/:courseId', protect, getCourseDiscussions);

// Get single discussion
router.get('/:discussionId', protect, getDiscussion);

// Create new discussion
router.post('/create', protect, createDiscussion);

// Add message to discussion
router.post('/:discussionId/messages', protect, addMessage);

// Add reaction to message
router.post('/:discussionId/messages/:messageId/reactions', protect, addReaction);

// Delete message
router.delete('/:discussionId/messages/:messageId', protect, deleteMessage);

module.exports = router;
