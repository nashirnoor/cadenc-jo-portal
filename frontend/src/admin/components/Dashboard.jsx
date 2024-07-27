import Sidebar from './Sidebar';
import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaUserTie, FaFileAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [userData, setUserData] = useState({
        totalUsers: 0,
        totalRecruiters: 0,
        totalPosts: 0
      });
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/v1/auth/api/user-stats/');
            setUserData(response.data);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchData();
      }, []);

  return (
     <>
      <Navbar />
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title="Total Users" 
            value={userData.totalUsers} 
            icon={<FaUsers />} 
            color="bg-blue-500"
          />
          <DashboardCard 
            title="Total Recruiters" 
            value={userData.totalRecruiters} 
            icon={<FaUserTie />} 
            color="bg-green-500"
          />
          <DashboardCard 
            title="Total Posts" 
            value={userData.totalPosts} 
            icon={<FaFileAlt />} 
            color="bg-purple-500"
          />
        </div>
      </div>
    </>
      
  )
}

const DashboardCard = ({ title, value, icon, color }) => {
    return (
      <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="text-3xl">{icon}</div>
        </div>
        <p className="text-4xl font-bold">{value}</p>
      </div>
    );
  };


export default Dashboard
