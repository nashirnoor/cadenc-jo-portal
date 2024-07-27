import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const { id: roomId } = useParams();
    const navigate = useNavigate();

    const fetchChatHistory = async (roomId) => {
        try {
            let jwt_a = JSON.parse(localStorage.getItem('access'));
            const response = await axios.get(`http://localhost:8000/api/v1/auth/chat/history/${roomId}/`, {
                headers: {
                    'Authorization': `Bearer ${jwt_a}`,
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };
    const fetchUnreadCounts = async () => {
        try {
          const jwt_a = JSON.parse(localStorage.getItem('access'));
          const response = await axios.get('http://localhost:8000/api/v1/auth/unread-message-counts/', {
            headers: {
              'Authorization': `Bearer ${jwt_a}`,
            }
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching unread counts:', error);
          return {};
        }
      };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUser', JSON.stringify(user));
        navigate(`/chat/${user.room_id}`);
    };

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const jwt_a = JSON.parse(localStorage.getItem('access'));
                const response = await axios.get(`http://localhost:8000/api/v1/auth/chat-room/${roomId}/`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_a}`,
                    }
                });
                setSelectedUser(response.data.other_user);
                fetchChatHistory(roomId);
            } catch (error) {
                console.error('Error fetching chat room:', error);
            }
        };

        if (roomId) {
            fetchChatRoom();
        }
    }, [roomId]);

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/4 bg-white shadow-lg">
                <div className="bg-indigo-600 p-4 text-white h-16" >
                    <Link to="/landing" className="flex items-center hover:text-indigo-200 transition duration-150 ease-in-out">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back 
                    </Link>
                </div>
                <UserList setSelectedUser={handleUserSelect} fetchUnreadCounts={fetchUnreadCounts} />
                </div>
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <ChatWindow selectedUser={selectedUser} messages={messages} setMessages={setMessages} />
                ) : (
                    <div className="flex items-center justify-center flex-1 bg-white text-gray-500 text-xl">
                        {roomId ? 'Loading user...' : 'Select a user to start chatting'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;