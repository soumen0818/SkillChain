import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Heart, ThumbsUp, Laugh, Angry, Reply, Trash2, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  getCourseDiscussions, 
  createDiscussion, 
  addMessage, 
  addReaction, 
  deleteMessage,
  Discussion,
  Message,
  AddMessageData 
} from '../lib/discussionApi';

interface ChatComponentProps {
  courseId: string;
  lessonId?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ courseId, lessonId }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [activeDiscussion, setActiveDiscussion] = useState<Discussion | null>(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Emoji reactions available
  const emojis = ['❤️', '👍', '😂', '😮', '😢', '😡', '🔥', '💯', '👏', '🎉'];

  // Get current user from localStorage
  const getCurrentUser = () => {
    const user = localStorage.getItem('skillchain_user');
    return user ? JSON.parse(user) : null;
  };

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadDiscussions();
  }, [courseId, lessonId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeDiscussion?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const response = await getCourseDiscussions(courseId, { lessonId });
      setDiscussions(response.discussions || []);
      
      // Set first discussion as active or create a general discussion
      if (response.discussions && response.discussions.length > 0) {
        setActiveDiscussion(response.discussions[0]);
      } else {
        // Create a general discussion for this course/lesson
        await createGeneralDiscussion();
      }
    } catch (error) {
      console.error('Error loading discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGeneralDiscussion = async () => {
    try {
      const discussionData = {
        courseId,
        title: lessonId ? 'Lesson Discussion' : 'Course Discussion',
        description: lessonId ? 'Discuss this lesson with your classmates' : 'General course discussion',
        type: 'general' as const,
        ...(lessonId && { lessonId }),
      };

      const newDiscussion = await createDiscussion(discussionData);
      setDiscussions([newDiscussion]);
      setActiveDiscussion(newDiscussion);
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeDiscussion || sending) return;

    try {
      setSending(true);
      const messageData: AddMessageData = {
        content: message.trim(),
        type: 'text',
      };

      const response = await addMessage(activeDiscussion._id, messageData);
      
      // Update the active discussion with the new message
      setActiveDiscussion(prev => prev ? {
        ...prev,
        messages: [...prev.messages, response.message]
      } : null);

      setMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!activeDiscussion) return;

    try {
      await addReaction(activeDiscussion._id, messageId, { emoji });
      
      // Update the message with new reaction
      setActiveDiscussion(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          messages: prev.messages.map(msg => {
            if (msg._id === messageId) {
              const existingReaction = msg.reactions.find(r => 
                r.emoji === emoji && r.user._id === currentUser?.id
              );
              
              if (existingReaction) {
                // Remove reaction
                return {
                  ...msg,
                  reactions: msg.reactions.filter(r => 
                    !(r.emoji === emoji && r.user._id === currentUser?.id)
                  )
                };
              } else {
                // Add reaction
                return {
                  ...msg,
                  reactions: [...msg.reactions, {
                    emoji,
                    user: {
                      _id: currentUser?.id || '',
                      username: currentUser?.username || '',
                      email: currentUser?.email || '',
                    },
                    timestamp: new Date().toISOString()
                  }]
                };
              }
            }
            return msg;
          })
        };
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeDiscussion) return;

    try {
      await deleteMessage(activeDiscussion._id, messageId);
      
      // Remove message from state
      setActiveDiscussion(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.filter(msg => msg._id !== messageId)
        };
      });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = (msg: Message) => {
    const isOwnMessage = msg.user._id === currentUser?.id;

    return (
      <div 
        key={msg._id} 
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}
      >
        <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
          {!isOwnMessage && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={msg.user.avatar} />
              <AvatarFallback>{msg.user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          
          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            {!isOwnMessage && (
              <span className="text-xs font-medium text-gray-600 mb-1">
                {msg.user.username}
              </span>
            )}
            
            <div className="relative group">
              <div
                className={`px-4 py-2 rounded-2xl shadow-sm ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900 border'
                } transition-all duration-200 hover:shadow-md`}
              >
                {msg.type === 'emoji' ? (
                  <span className="text-2xl">{msg.emoji}</span>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
                
                {msg.edited && (
                  <span className="text-xs opacity-70 ml-2">(edited)</span>
                )}
              </div>

              {/* Message actions */}
              <div className={`absolute top-0 ${isOwnMessage ? 'left-0' : 'right-0'} -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                <div className="flex items-center space-x-1 bg-white border rounded-full px-2 py-1 shadow-lg">
                  {/* Reaction buttons */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                        <Smile className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" side="top">
                      <div className="flex space-x-1">
                        {emojis.map(emoji => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleReaction(msg._id, emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {isOwnMessage && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 hover:bg-red-100 text-red-500"
                      onClick={() => handleDeleteMessage(msg._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Reactions display */}
            {msg.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(
                  msg.reactions.reduce((acc: { [key: string]: any[] }, reaction) => {
                    if (!acc[reaction.emoji]) acc[reaction.emoji] = [];
                    acc[reaction.emoji].push(reaction);
                    return acc;
                  }, {})
                ).map(([emoji, reactions]: [string, any[]]) => (
                  <TooltipProvider key={emoji}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 py-0 text-xs bg-white hover:bg-gray-50 border-gray-200"
                          onClick={() => handleReaction(msg._id, emoji)}
                        >
                          <span className="mr-1">{emoji}</span>
                          <span>{reactions.length}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reactions.map(r => r.user.username).join(', ')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}

            <span className="text-xs text-gray-500 mt-1">
              {formatMessageTime(msg.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h3 className="font-semibold text-gray-900">
            {activeDiscussion?.title || 'Discussion'}
          </h3>
          <p className="text-sm text-gray-600">
            {activeDiscussion?.participants.length || 0} participants
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          {activeDiscussion?.type || 'general'}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {activeDiscussion?.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h4>
            <p className="text-gray-600 max-w-sm">
              Be the first to share your thoughts, ask questions, or help your classmates!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDiscussion?.messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="pr-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={sending}
            />
            
            {/* Emoji picker button */}
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Smile className="w-4 h-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side="top">
                <div className="grid grid-cols-5 gap-1">
                  {emojis.map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
