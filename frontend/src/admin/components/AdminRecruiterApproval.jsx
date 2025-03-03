import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from './Navbar';
import Sidebar from './Sidebar';  
import { NavLink } from 'react-router-dom';
import { BASE_URL } from '../../utils/config';

const AdminRecruiterApproval = () => {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
        let token = localStorage.getItem('access_token');

      const res = await axios.get(`${BASE_URL}/api/v1/auth/admin/recruiters/pending/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      });
      setRecruiters(res.data);
    } catch (error) {
        console.log(token)
      toast.error('Failed to fetch recruiters');
    }
  };

  const handleApproval = async (recruiterId, action) => {
    try {
      let token = localStorage.getItem('access_token');
      
      await axios.post(
        `${BASE_URL}/api/v1/auth/admin/recruiters/pending/${recruiterId}/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        }
      );
      
      fetchRecruiters();
      toast.success(`Recruiter ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} recruiter`);
    }
  };
  

  return (
    <>
    <Navbar />
      <Sidebar />
    <div className="container mx-auto ml-56 p-20">
      <h2 className="text-2xl font-bold mb-4">Pending Recruiter Approvals</h2>
      {recruiters.length === 0 ? (
        <p className="text-gray-600">No pending recruiters</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Company Name</th>
                <th className="py-2 px-4 border-b">Approve / Reject</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((recruiter) => (
                <tr key={recruiter.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{recruiter.email}</td>
                  <td className="py-2 px-4 border-b">{recruiter.first_name}</td>
                  <td className="py-2 px-4 border-b">{recruiter.company_name}</td>
                  <td className="py-2 px-4 border-b mr-1">
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:bg-green-600"
                      onClick={() => handleApproval(recruiter.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      onClick={() => handleApproval(recruiter.id, 'reject')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  
    </>
  );
};

export default AdminRecruiterApproval;
