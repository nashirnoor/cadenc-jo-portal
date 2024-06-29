import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axiosInstance from '../../users/utils/axiosInstance';

const RecruiterList = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const token = localStorage.getItem('access_token'); // No need to parse the token
        if (!token) {
          throw new Error('No access token found');
        }
        const response = await axiosInstance.get('http://localhost:8000/api/v1/auth/recruiters/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecruiters(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
        setError('Error fetching recruiters');
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="card ml-56 p-20">
        <div className="relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3"> Name</th>
                <th scope="col" className="px-6 py-3">Is Staff</th>
                <th scope="col" className="px-6 py-3">Is Superuser</th>
                <th scope="col" className="px-6 py-3">Company Name</th>
                <th scope="col" className="px-6 py-3">Date Joined</th>
                <th scope="col" className="px-6 py-3">Last Login</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map(recruiter => (
                <tr key={recruiter.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-white">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{recruiter.id}</td>
                  <td className="px-6 py-4">{recruiter.email}</td>
                  <td className="px-6 py-4">{recruiter.first_name}</td>
                  <td className="px-6 py-4">{recruiter.is_staff ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{recruiter.is_superuser ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{recruiter.company_name}</td>
                  <td className="px-6 py-4">{new Date(recruiter.date_joined).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(recruiter.last_login).toLocaleDateString()}</td>
                  {/* <td className="px-6 py-4">{recruiter.user_type}</td> */}
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

export default RecruiterList;
