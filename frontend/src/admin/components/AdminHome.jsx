import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';


const AdminHome = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('access_token'); // Get the token from localStorage
          const response = await axios.get('http://localhost:8000/api/v1/auth/users/', {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the header
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }

  return (
    <>
   <Navbar/>
   <Sidebar/>

    <div className="card ml-56 p-20">
    <div className="relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                         First Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                         Phone Number
                    </th>
                  
                    <th scope="col" className="px-6 py-3">
                        Is Staff
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Is Superuser
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Is Active
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Date joined 
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Last Login 
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
            {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-white">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user.id}
                                </td>
                                <td className="px-6 py-4">
                                {user.email}
                                </td>
                                <td className="px-6 py-4">
                                {user.first_name}
                                </td>
                                <td className="px-6 py-4">
                                {user.phone_number}
                                </td>
                              
                                <td className="px-6 py-4">
                                {user.is_staff ? 'Yes' : 'No'}    
                                </td>
                                <td className="px-6 py-4">
                                {user.is_superuser ? 'Yes' : 'No'}
                                </td>
                                
                                <td className="px-6 py-4">
                                {user.is_active ? 'Yes' : 'No'}
                                </td>
                                <td className="px-6 py-4">
                                {new Date(user.date_joined).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                {new Date(user.last_login).toLocaleString()}
                                </td>
                                {/* <td className="px-6 py-4">
                                {user.user_type}
                                </td> */}
                                <td className="px-6 py-4 text-right">
                                    <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Block</span>
                                </td>
                            </tr>
            ))}                     
            </tbody>
        </table>
    </div>
</div>
</>
  );
};

export default AdminHome;
