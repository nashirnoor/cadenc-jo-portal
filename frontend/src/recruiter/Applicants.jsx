import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './RecruiterHeader';
import Footer from '../users/components/Footer';


const Applicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { jobId } = useParams();
  
    useEffect(() => {
      const fetchApplicants = async () => {
        try {
          const jwt_a = JSON.parse(localStorage.getItem('access'));
          const response = await axios.get(`http://localhost:8000/api/v1/auth/${jobId}/applicants/`, {
            headers: {
              'Authorization': `Bearer ${jwt_a}`,
            }
          });
          setApplicants(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchApplicants();
    }, [jobId]);
  
    const handleDownload = async (applicationId) => {
        console.log(`Attempting to download resume for application ID: ${applicationId}`);
        try {
          const jwt_a = JSON.parse(localStorage.getItem('access'));
          
          const response = await axios.get(
            `http://localhost:8000/api/v1/auth/download-resume/${applicationId}/`,
            {
              headers: {
                'Authorization': `Bearer ${jwt_a}`,
              },
              responseType: 'blob',
            }
          );
      
          // Check if the response is actually a PDF
          if (response.headers['content-type'] === 'application/pdf') {
            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `resume_${applicationId}.pdf`;
            link.click();
            URL.revokeObjectURL(fileURL);
          } else {
            // If it's not a PDF, it might be an error message
            const reader = new FileReader();
            reader.onload = function() {
              console.error("Server response:", this.result);
              alert("Error: " + this.result);
            };
            reader.readAsText(response.data);
          }
        } catch (err) {
            console.error("Error downloading file:", err);
            if (err.response) {
              console.log("Error response status:", err.response.status);
              console.log("Error response headers:", err.response.headers);
              console.log("Error response data:", err.response.data);
              alert(`Error: ${err.response.data.error || "Unknown error occurred"}`);
            } else {
              alert("Network error occurred. Please try again later.");
            }
          }
        }
  
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
                            onClick={() => handleDownload(applicant.id)} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Download resume
                          </button>
                        ) : 'No resume'}
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