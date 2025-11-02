import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllConversations, getConversation, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSend, FiMessageCircle, FiSearch, FiMoreVertical, FiPhone, FiVideo, FiPaperclip, FiSmile } from 'react-icons/fi';
import io from 'socket.io-client';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('user_online', user.id);

    socketRef.current.on('receive_message', (data) => {
      if (data.sender === selectedConversation?.partner._id) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
      }
      fetchConversations();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, selectedConversation]);

  useEffect(() => {
    fetchConversations();
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      loadConversationWithUser(userIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await getAllConversations();
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationWithUser = async (userId) => {
    if (!user) return;
    
    try {
      const response = await getConversation(userId);
      
      if (response.data.messages.length === 0) {
        const partnerResponse = await fetch(`http://localhost:5000/api/users/${userId}`);
        const partnerData = await partnerResponse.json();
        
        const conversation = {
          partner: partnerData.user
        };
        
        setSelectedConversation(conversation);
        setMessages([]);
        return;
      }
      
      const conversation = {
        partner: response.data.messages[0]?.sender?._id === user.id 
          ? response.data.messages[0]?.recipient 
          : response.data.messages[0]?.sender
      };
      
      setSelectedConversation(conversation);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const response = await getConversation(conversation.partner._id);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    const messageData = {
      recipientId: selectedConversation.partner._id,
      content: messageText
    };

    try {
      const response = await sendMessage(messageData);
      setMessages(prev => [...prev, response.data.message]);
      
      socketRef.current.emit('send_message', {
        ...response.data.message,
        recipientId: selectedConversation.partner._id
      });
      
      setMessageText('');
      scrollToBottom();
      fetchConversations();
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
              <FiMessageCircle className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm text-primary-100">Stay connected with vendors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col shadow-lg"
        >
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <FiMessageCircle className="text-gray-400 text-5xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No conversations yet</h3>
                <p className="text-sm text-gray-600">Start chatting with vendors!</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.partner?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleConversationClick(conversation)}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 border-l-4 ${
                      selectedConversation?.partner?._id === conversation.partner?._id
                        ? 'bg-primary-50 border-primary-600'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={conversation.partner?.profileImage}
                        alt={conversation.partner?.fullName}
                        className="w-14 h-14 rounded-full border-2 border-white shadow-md"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 ml-4 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.partner?.fullName}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conversation.lastMessage?.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="inline-block bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full mt-1">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={selectedConversation.partner?.profileImage}
                      alt={selectedConversation.partner?.fullName}
                      className="w-12 h-12 rounded-full border-2 border-primary-500"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">
                      {selectedConversation.partner?.fullName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.partner?.university}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiPhone className="text-gray-600" size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiVideo className="text-gray-600" size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiMoreVertical className="text-gray-600" size={20} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-chat-pattern">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="bg-primary-100 p-6 rounded-full inline-block mb-4">
                        <FiMessageCircle className="text-primary-600 text-5xl" />
                      </div>
                      <p className="text-gray-600 text-lg">Start the conversation!</p>
                      <p className="text-gray-500 text-sm mt-2">Send your first message below</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwnMessage = message.sender?._id === user?.id || message.sender === user?.id;
                      return (
                        <motion.div
                          key={message._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-5 py-3 rounded-2xl shadow-md ${
                                isOwnMessage
                                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-none'
                                  : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
                              }`}
                            >
                              <p className="break-words leading-relaxed">{message.content}</p>
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                <p
                                  className={`text-xs ${
                                    isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </p>
                                {isOwnMessage && (
                                  <svg className="w-4 h-4 text-primary-100" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                  >
                    <FiPaperclip size={22} />
                  </motion.button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-5 py-3 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:bg-white focus:border-primary-500 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
                    >
                      <FiSmile size={22} />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend size={20} />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gradient-to-br from-primary-100 to-lightGreen-100 p-8 rounded-full inline-block mb-6">
                  <FiMessageCircle className="text-primary-600 text-7xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Select a conversation
                </h3>
                <p className="text-gray-600 max-w-md">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;