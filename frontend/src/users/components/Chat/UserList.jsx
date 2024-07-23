import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ setSelectedUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the backend
        const fetchUsers = async () => {
            try {
                let jwt_a = localStorage.getItem('access');
                jwt_a = JSON.parse(jwt_a);
                const response = await axios.get('http://localhost:8000/api/v1/auth/all-users', {
                    headers: {
                        'Authorization': `Bearer ${jwt_a}`,
                    }
                }); // Replace with your API endpoint
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="h-full overflow-y-auto">
            <h2 className="text-xl font-semibold p-4 border-b border-gray-200 bg-gray-50">Chats</h2>
            <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="flex items-center p-4 hover:bg-indigo-50 cursor-pointer transition duration-150 ease-in-out"
                        onClick={() => setSelectedUser(user)}
                    >
                        <img
                            src={user.profile_photo || 'https://via.placeholder.com/40?text=No+Photo'}
                            alt={user.first_name}
                            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-200"
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">{user.first_name}</h3>
                            <p className="text-sm text-gray-500 truncate">Last message...</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
