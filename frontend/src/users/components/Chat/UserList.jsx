// src/components/UserList.js
import React from 'react';

const UserList = ({ users, onSelectUser }) => {
  return (
    <div className="w-1/4 bg-white border-r">
      <h2 className="text-xl font-semibold p-4 border-b">Chat Users</h2>
      {users.length === 0 ? (
        <p className="p-4 text-gray-500">No active chats</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelectUser(user)}
            >
              {user.first_name} ({user.email})
              <span className="text-sm text-gray-500 block">
                {user.user_type === 'recruiter' ? 'Recruiter' : 'User'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;