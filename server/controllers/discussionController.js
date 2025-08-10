const Discussion = require('../models/Discussion');
const User = require('../models/User');
const Course = require('../models/Course');

// Get all discussions for a course
const getCourseDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, type, page = 1, limit = 20 } = req.query;

    const query = { courseId, isActive: true };
    if (lessonId) query.lessonId = lessonId;
    if (type) query.type = type;

    const discussions = await Discussion.find(query)
      .populate('createdBy', 'username email avatar')
      .populate('participants.user', 'username email avatar')
      .populate('messages.user', 'username email avatar')
      .populate('messages.reactions.user', 'username email avatar')
      .populate('messages.replies.user', 'username email avatar')
      .sort({ isPinned: -1, lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      discussions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(await Discussion.countDocuments(query) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discussions'
    });
  }
};

// Get single discussion with messages
const getDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId)
      .populate('createdBy', 'username email avatar')
      .populate('participants.user', 'username email avatar')
      .populate('messages.user', 'username email avatar')
      .populate('messages.reactions.user', 'username email avatar')
      .populate('messages.replies.user', 'username email avatar');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Update last seen for current user
    if (req.user) {
      await discussion.updateLastSeen(req.user._id);
    }

    res.json({
      success: true,
      discussion
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discussion'
    });
  }
};

// Create new discussion
const createDiscussion = async (req, res) => {
  try {
    const { courseId, title, description, type = 'general', lessonId, tags } = req.body;

    // Verify user is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const isEnrolled = course.students.includes(req.user._id) || 
                     course.teacher.toString() === req.user._id.toString();
    
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    const discussion = new Discussion({
      courseId,
      lessonId,
      title,
      description,
      type,
      tags: tags || [],
      createdBy: req.user._id,
      participants: [{
        user: req.user._id,
        joinedAt: new Date(),
        lastSeen: new Date()
      }]
    });

    await discussion.save();

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('createdBy', 'username email avatar')
      .populate('participants.user', 'username email avatar');

    res.status(201).json({
      success: true,
      discussion: populatedDiscussion
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating discussion'
    });
  }
};

// Add message to discussion
const addMessage = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content, type = 'text', emoji, fileUrl, fileName } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const messageData = {
      content,
      type,
      emoji,
      fileUrl,
      fileName,
      user: req.user._id,
      timestamp: new Date()
    };

    await discussion.addMessage(messageData);

    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate('messages.user', 'username email avatar')
      .populate('messages.reactions.user', 'username email avatar');

    const newMessage = updatedDiscussion.messages[updatedDiscussion.messages.length - 1];

    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message'
    });
  }
};

// Add reaction to message
const addReaction = async (req, res) => {
  try {
    const { discussionId, messageId } = req.params;
    const { emoji } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const message = discussion.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it exists
      message.reactions.pull(existingReaction._id);
    } else {
      // Add new reaction
      message.reactions.push({
        emoji,
        user: req.user._id,
        timestamp: new Date()
      });
    }

    await discussion.save();

    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate('messages.reactions.user', 'username email avatar');

    const updatedMessage = updatedDiscussion.messages.id(messageId);

    res.json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reaction'
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { discussionId, messageId } = req.params;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const message = discussion.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user owns the message or is course teacher
    const course = await Course.findById(discussion.courseId);
    const canDelete = message.user.toString() === req.user._id.toString() || 
                     course.teacher.toString() === req.user._id.toString();

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    discussion.messages.pull(messageId);
    discussion.messageCount = discussion.messages.length;
    await discussion.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message'
    });
  }
};

module.exports = {
  getCourseDiscussions,
  getDiscussion,
  createDiscussion,
  addMessage,
  addReaction,
  deleteMessage
};
