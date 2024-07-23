import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './RecruiterHeader';
import Footer from '../users/components/Footer';
import { useNavigate } from 'react-router-dom';
import fileDownload from "js-file-download";


const Applicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { jobId } = useParams();
    const navigate = useNavigate();

    const handleStartChat = (applicantId) => {
      navigate(`/chat/${applicantId}`);
  };
  
    useEffect(() => {
      const fetchApplicants = async () => {
        try {
          const jwt_a = JSON.parse(localStorage.getItem('access'));
          const response = await axios.get(`http://localhost:8000/api/v1/auth/${jobId}/applicants/`, {
            headers: {
              'Authorization': `Bearer ${jwt_a}`,
            }
          });
          console.log(response.data)
          setApplicants(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchApplicants();
    }, [jobId]);
  
    const handleDownload = async (resumeUrl) => {
      try {
          if (resumeUrl) {
              const response = await fetch(resumeUrl);
              console.log(response)

              if (!response.ok) {
                  throw new Error("Error while fetching CV using URL");
              }

              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'resume.pdf');
              document.body.appendChild(link);
              link.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(link);
          } else {
              console.error("ERROR: Invalid CV URL");
          }
      } catch (error) {
          console.error("ERROR: Failed to download PDF", error);
      }
  };
          
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <>
        <Header />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray mb-8">Applicants</h1>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-950 text-white">
                  <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Relocate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Immediate Joinee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Resume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Message</th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants.map((applicant, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{applicant.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.email}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.experience}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.is_willing_to_relocate ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.is_immediate_joinee ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">
                                            {applicant.resume_url ? (
                                                <button 
                                                    onClick={() => handleDownload(applicant.resume_url)} 
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Download resume
                                                </button>
                                            ) : 'No resume'}
                                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">
                                            <button 
                                                onClick={() => handleStartChat(applicant.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Start Chat
                                            </button>
                                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  };
  
export default Applicants;