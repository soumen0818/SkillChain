const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('skillchain_user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface Discussion {
  _id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  type: 'general' | 'question' | 'announcement';
  tags: string[];
  isActive: boolean;
  isPinned: boolean;
  participants: {
    user: {
      _id: string;
      username: string;
      email: string;
      avatar?: string;
    };
    joinedAt: string;
    lastSeen: string;
  }[];
  messages: Message[];
  createdBy: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  messageCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  type: 'text' | 'emoji' | 'file';
  emoji?: string;
  fileUrl?: string;
  fileName?: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  timestamp: string;
  edited: boolean;
  editedAt?: string;
  reactions: {
    emoji: string;
    user: {
      _id: string;
      username: string;
      email: string;
      avatar?: string;
    };
    timestamp: string;
  }[];
  replies: {
    content: string;
    user: {
      _id: string;
      username: string;
      email: string;
      avatar?: string;
    };
    timestamp: string;
  }[];
}

export interface CreateDiscussionData {
  courseId: string;
  title: string;
  description?: string;
  type?: 'general' | 'question' | 'announcement';
  lessonId?: string;
  tags?: string[];
}

export interface AddMessageData {
  content: string;
  type?: 'text' | 'emoji' | 'file';
  emoji?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface AddReactionData {
  emoji: string;
}

// Get discussions for a course
export const getCourseDiscussions = async (
  courseId: string,
  options?: {
    lessonId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }
) => {
  const params = new URLSearchParams();
  if (options?.lessonId) params.append('lessonId', options.lessonId);
  if (options?.type) params.append('type', options.type);
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());

  const response = await fetch(`${API_BASE_URL}/discussions/course/${courseId}?${params.toString()}`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch course discussions');
  }

  return response.json();
};

// Get single discussion
export const getDiscussion = async (discussionId: string) => {
  const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}`, {
    headers: createHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch discussion');
  }

  return response.json();
};

// Create new discussion
export const createDiscussion = async (data: CreateDiscussionData) => {
  const response = await fetch(`${API_BASE_URL}/discussions/create`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create discussion');
  }

  return response.json();
};

// Add message to discussion
export const addMessage = async (discussionId: string, data: AddMessageData) => {
  const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/messages`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add message');
  }

  return response.json();
};

// Add reaction to message
export const addReaction = async (
  discussionId: string,
  messageId: string,
  data: AddReactionData
) => {
  const response = await fetch(
    `${API_BASE_URL}/discussions/${discussionId}/messages/${messageId}/reactions`,
    {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add reaction');
  }

  return response.json();
};

// Delete message
export const deleteMessage = async (discussionId: string, messageId: string) => {
  const response = await fetch(`${API_BASE_URL}/discussions/${discussionId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: createHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete message');
  }

  return response.json();
};
