import React from 'react';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        const savedUser = localStorage.getItem('selectedUser');
        if (savedUser) {
            setSelectedUser(JSON.parse(savedUser));
        }
    }, []);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUser', JSON.stringify(user));
    };

    return (
        <div className="flex h-screen bg-gray-100 px-20">
        <div className="w-1/4 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
                <Link to="/landing" className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Landing
                </Link>
            </div>
            <UserList setSelectedUser={handleUserSelect} />
        </div>
        <div className="flex-1 flex flex-col">
            {selectedUser ? (
                <ChatWindow selectedUser={selectedUser} messages={messages} setMessages={setMessages} />
            ) : (
                <div className="flex items-center justify-center flex-1 bg-white text-gray-500 text-xl">
                    Select a user to start chatting
                </div>
            )}
        </div>
    </div>
    );
};


export default ChatPage