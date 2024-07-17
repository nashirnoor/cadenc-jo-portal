// src/components/ChatPage.js
import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import ChatArea from './ChatArea';
import axios from 'axios';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
    let jwt_a = localStorage.getItem('access');
    jwt_a = JSON.parse(jwt_a);
      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${jwt_a}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <UserList users={users} onSelectUser={setSelectedUser} />
      {selectedUser && <ChatArea selectedUser={selectedUser} />}
    </div>
  );
};

export default ChatPage;