import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWindow = ({ selectedUser, messages, setMessages }) => {
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);


    const connectWebSocket = () => {
      let jwt_a = localStorage.getItem('access');
      jwt_a = JSON.parse(jwt_a);

      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${selectedUser.id}/?token=${jwt_a}`);

      ws.onopen = () => {
          console.log('Connected to WebSocket server');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, {
            sender: data.sent ? 'You' : selectedUser.first_name,
            text: data.message,
            date: data.date || new Date().toISOString() // Fallback to current date if not provided
        }]);
    };
      ws.onclose = () => {
          console.log('Disconnected from WebSocket server');
      };

      socketRef.current = ws;
  };

  useEffect(() => {
    fetchChatHistory();
    connectWebSocket();

    return () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
    };
}, [selectedUser]);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

  const fetchChatHistory = async () => {
    try {
        let jwt_a = localStorage.getItem('access');
        jwt_a = JSON.parse(jwt_a);
        const response = await axios.get(`http://localhost:8000/api/v1/auth/chat/history/${selectedUser.id}/`, {
            headers: {
                'Authorization': `Bearer ${jwt_a}`,
            }
        });
        setMessages(response.data.map(msg => ({
            sender: msg.sender === selectedUser.id ? selectedUser.first_name : 'You',
            text: msg.content,
            date: msg.date
        })));
    } catch (error) {
        console.error('Error fetching chat history:', error);
    }
};

    const handleSendMessage = () => {
      if (newMessage.trim() !== '' && socketRef.current) {
          const message = {
              message: newMessage,
              user_id: selectedUser.id,
              date: new Date().toISOString()
          };
          socketRef.current.send(JSON.stringify(message));
          setNewMessage('');
          // Remove the setMessages call from here
      }
  };

    return (
      <div className="flex flex-col h-full bg-white shadow-lg">
      <div className="bg-blue-600 text-white p-4 flex items-center">
          <img
              src={selectedUser.profile_photo || 'https://via.placeholder.com/40?text=No+Photo'}
              alt={selectedUser.first_name}
              className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <h2 className="text-xl font-semibold">{selectedUser.first_name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
              <div
                  key={index}
                  className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                  <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                          message.sender === 'You'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                      <p>{message.text}</p>
                      {message.date && (
                          <span className="text-xs opacity-75 mt-1 block">
                              {new Date(message.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                      )}
                  </div>
              </div>
          ))}
                          <div ref={messagesEndRef} />

      </div >
      <div className="p-4 border-t border-gray-200">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex">
              <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                  Send
              </button>
          </form>
      </div>
  </div>
    );
};

export default ChatWindow;
