import React from 'react';
import {FaHome,FaRegFileAlt,FaUser} from 'react-icons/fa';
import {Link} from 'react-router-dom';


const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-800 fixed h-full px-4 py-2'>
        <div className='my-2 mb-4'>
            <h1 className='text-2x text-white font-bold'>Admin Dashboard</h1>
        </div>    
        <hr/>
        <ul className='mt-3 text-white font-bold'>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href='' className='px-3'>
                    <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                    <Link to="/dashboard">Dashboard</Link>
                </a>
            </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href='' className='px-3'>
                    <FaUser className='inline-block w-6 h-6 mr-2 -mt-2'></FaUser>
                    <Link to="/admin-home">User</Link>
                </a>
            </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a className='px-3'>
                    <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                    <Link to='/recruiter-list'>Recruiter</Link>
                    
                </a>
            </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a className='px-3'>
                    <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                    <Link to='/recruiter-approval'>Approval</Link>
                    
                </a>
            </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a className='px-3'>
                    <FaRegFileAlt className='inline-block w-6 h-6 mr-2 -mt-2'></FaRegFileAlt>
                    <Link to='/skill-management'>Skills</Link>
                    
                </a>
            </li>
          
        </ul>  
    </div>
  )
}

export default Sidebar

