import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BeatLoader } from 'react-spinners';

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/v1/auth/users/?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setUsers(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5)); // Assuming 5 users per page
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    fetchUsers();

    return () => clearTimeout(loaderTimer);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    setLoading(true);
    setShowLoader(true);
  };

  if (loading || showLoader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader color="#1263ad" size={15} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="card ml-56 p-20 pt-10">
        <div className="relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">First Name</th>
                <th scope="col" className="px-6 py-3">Phone Number</th>
                <th scope="col" className="px-6 py-3">Is Staff</th>
                <th scope="col" className="px-6 py-3">Is Superuser</th>
                <th scope="col" className="px-6 py-3">Is Active</th>
                <th scope="col" className="px-6 py-3">Date Joined</th>
                <th scope="col" className="px-6 py-3">Last Login</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className='h-1'>
              {users.map(user => (
                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-white">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.first_name}</td>
                  <td className="px-6 py-4">{user.phone_number}</td>
                  <td className="px-6 py-4">{user.is_staff ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{user.is_superuser ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{user.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{new Date(user.date_joined).toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(user.last_login).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Block</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='ml-96 mt-24'>
          <Stack spacing={2}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
          </Stack>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
