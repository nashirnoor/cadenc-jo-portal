import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetailsPage = () => {
  const [job, setJob] = useState(null);
  const { id } = useParams();
  const defaultImage = "/images/company-image-default.png";
  const companyLogo = job?.company_logo ? job.company_logo : defaultImage;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/auth/api/jobs/${id}/`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{job.job_title}</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
      <div className='company-logo'>
          <img src={companyLogo} alt="Company Logo" className='w-14 h-14 object-cover rounded-full' />
        </div>
        <div className="mb-4">
          <strong>Company:</strong> {job.recruiter}
        </div>
        <div className="mb-4">
          <strong>Job Type:</strong> {job.job_type}
        </div>
        <div className="mb-4">
          <strong>Salary:</strong> {job.salary}
        </div>
        <div className="mb-4">
          <strong>Location:</strong> {job.job_location}
        </div>
        <div className="mb-4">
          <strong>Experience:</strong> {job.experience}
        </div>
        <div className="mb-4">
          <strong>Vacancies:</strong> {job.vacancies}
        </div>
        <div className="mb-4">
          <strong>Description:</strong>
          <p>{job.job_description}</p>
        </div>
        <div className="mb-4">
          <strong>Core Responsibilities:</strong>
          <p>{job.core_responsibilities}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;