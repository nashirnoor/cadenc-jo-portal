import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3, FiUpload } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { companies, jobs } from "../utils/data";
import CustomButton from "../users/components/Custombutton";
import JobCard from "../users/components/JobCard";
import Loading from "../users/components/Loading";
import TextInput from "../users/components/TextInput";
import Footer from "../users/components/Footer";
import { useNavigate } from "react-router-dom";
import Header from "./RecruiterHeader";
import axios from "axios";
import { FaUsers } from "react-icons/fa";

import axiosInstance from '../users/utils/axiosInstance';



const CompanyForm = ({ open, setOpen, companyInfo, onSubmit }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: companyInfo,
  });

  useEffect(() => {
    if (companyInfo) {
      setValue("company_name", companyInfo.company_name);
      setValue("company_location", companyInfo.company_location);
      setValue("contact_number", companyInfo.contact_number);
      setValue("email_address", companyInfo.email_address);
      setValue("company_strength", companyInfo.company_strength);
    }
  }, [companyInfo, setValue]);

  const user = JSON.parse(localStorage.getItem('user'));
  const jwt_access = localStorage.getItem('access');

  const closeModal = () => setOpen(false);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === "company_logo") {
        formData.append(key, data[key][0]); // Get the file object
      } else {
        formData.append(key, data[key]);
      }
    }

    const url = companyInfo 
      ? `http://localhost:8000/api/v1/auth/company-profile/update/${companyInfo.id}/`
      : 'http://localhost:8000/api/v1/auth/company-profile/';

    const method = companyInfo ? 'put' : 'post';

    axiosInstance[method](url, formData, {
      headers: {
        'Authorization': `Bearer ${jwt_access}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        if (typeof onSubmit === 'function') {
          onSubmit(response.data);
        } else {
          console.log(response.data);
        }
        closeModal();
      })
      .catch(error => {
        console.error('Error encountered:', error);
      });
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={closeModal}></div>
            <div className="relative bg-white rounded-2xl text-left shadow-xl transform transition-all max-w-md w-full p-6 z-10">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {companyInfo ? "Edit Company Profile" : "Create Company Profile"}
              </h3>
              <form className="w-full mt-2 flex flex-col gap-5" onSubmit={handleSubmit(handleFormSubmit)} encType="multipart/form-data">
                <TextInput
                  name='company_name'
                  label='Company Name'
                  type='text'
                  register={register("company_name", { required: "Company Name is required" })}
                  error={errors.company_name ? errors.company_name.message : ""}
                />
                <TextInput
                  name='company_location'
                  label='Location/Address'
                  placeholder='eg. California'
                  type='text'
                  register={register("company_location", { required: "Address is required" })}
                  error={errors.company_location ? errors.company_location.message : ""}
                />
                <TextInput
                  name='contact_number'
                  label='Contact'
                  placeholder='Phone Number'
                  type='text'
                  register={register("contact_number", { required: "Contact is required!" })}
                  error={errors.contact_number ? errors.contact_number.message : ""}
                />
                <TextInput
                  name='email_address'
                  label='Email'
                  placeholder='Company Email'
                  type='email'
                  register={register("email_address", { 
                    required: "Email is required!", 
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })}
                  error={errors.email_address ? errors.email_address.message : ""}
                />
                <TextInput
                  name='company_strength'
                  label='Company Strength'
                  placeholder='Company Strength'
                  type='text'
                  register={register("company_strength", { required: "Company Strength is required!" })}
                  error={errors.company_strength ? errors.company_strength.message : ""}
                />
                <div className='w-full mt-2'>
                  <label className='text-gray-600 text-sm mb-1'>Company Profile Photo</label>
                  {companyInfo && companyInfo.company_logo && (
                    <div className='mb-4'>
                      <img
                        src={companyInfo.company_logo}
                        alt='Company Logo'
                        className='w-16 h-16 object-cover rounded-md'
                      />
                    </div>
                  )}
                  <input
                      type='file'
                      accept='image/*'
                      {...register("company_logo", { required: "Company Profile Photo is required" })}
                      className='w-full border border-gray-300 rounded-md p-2'
                    />

                  {errors.company_logo && (
                    <span className='text-xs text-red-500 mt-0.5'>
                      {errors.company_logo.message}
                    </span>
                  )}
                </div>
                <div className='mt-4'>
                  <CustomButton
                    type='submit'
                    containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                    title={"Submit"}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const CompanyProfile = () => {
  const params = useParams();
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  const [jobs2, setJobs2] = useState([]);


  useEffect(() => {

    setInfo(companies[parseInt(params?.id) - 1 ?? 0]);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    getCompanyProfile();
  }, [params]);

  const user = JSON.parse(localStorage.getItem('user'));
  const jwt_access = localStorage.getItem('access');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let jwt_a = localStorage.getItem('access');
    jwt_a = JSON.parse(jwt_a);
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/auth/jobs/', {
          headers: {
            'Authorization': `Bearer ${jwt_a}`,
          }
        });
        setJobs(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);



  const getCompanyProfile = async () => {
    try {
      let jwt_access = localStorage.getItem('access');
      jwt_access = JSON.parse(jwt_access);

      if (!jwt_access) {
        throw new Error("JWT token is missing");
      }

      const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/company-profile-get/', {

        headers: {
          'Authorization': `Bearer ${jwt_access}`,
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        setCompanyInfo(response.data);
        setIsLoading(false);
      } else {
        console.error('Error fetching company profile:', response.status, response.statusText);
      }

    } catch (error) {
      console.error('Error fetching company profile:', error);
      setIsLoading(false);
    }
  };




  useEffect(() => {
    if (!jwt_access && !user) {
      navigate("/login");
    } else {
    }
  }, [jwt_access, user, navigate]);


  const handleLogout = async () => {
    try {
      const refresh_token = JSON.parse(localStorage.getItem('refresh'));
      await axiosInstance.post("/auth/logout/", { refresh_token });
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      navigate('/login');
      toast.success("Logout successful");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleFormSubmit = (formData) => {
    axios.post('http://127.0.0.1:8000/api/v1/auth/company-profile/', formData, {
      headers: {
        Authorization: `Bearer ${jwt_access}`
      }
    })
      .then(response => {
        setCompanyInfo(response.data);
        setOpenForm(false);
      })
      .catch(error => console.error('Error updating company profile:', error));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className='container mx-auto p-5'>
        <div className=''>
          <div className='w-full flex flex-col md:flex-row gap-3 justify-between'>
            <h2 className='text-gray-600 text-xl font-semibold'>
              Welcome, {companyInfo?.company_name ?? "Company"}
            </h2>

            <div className='flex items-center justify-center py-5 md:py-0 gap-4'>
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>

              <Link to='/upload-job'>
                <CustomButton
                  title='Upload Job'
                  containerStyles={`text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none rounded text-sm md:text-base border border-blue-600`}
                />
              </Link>
            </div>
          </div>

          <div className='w-full flex flex-col md:flex-row justify-start md:justify-between mt-4 md:mt-8 text-sm'>
            <p className='flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full'>
              <HiLocationMarker /> {companyInfo?.company_location ?? "No Location"}
            </p>
            <p className='flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full'>
              <FiPhoneCall /> {companyInfo?.contact_number ?? "No Contact"}
            </p>
            <p className='flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full'>
            <FaUsers />   {companyInfo?.company_strength ?? "No Company Strength"}
            </p>
            <p className='flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full'>
              <AiOutlineMail /> {companyInfo?.email_address ?? "No Email"}
            </p>
            {companyInfo?.company_logo && (
  <div className='company-logo'>
    <img src={companyInfo.company_logo} alt="Company Logo" className='w-24 h-24 object-cover rounded-full' />
  </div>
)}
                   <div>
            <button
              onClick={() => setOpenForm(true)}
              className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-150 ease-in-out"
            >
              Edit Profile
            </button>
            </div>
            <CompanyForm open={openForm} setOpen={setOpenForm} companyInfo={companyInfo} onSubmit={handleFormSubmit} />

            <div className='flex flex-col items-center mt-10 md:mt-0'>
              <span className='text-xl'>{info?.jobPosts?.length}</span>
              <p className='text-blue-600 '>Job Post</p>
            </div>
          </div>
        </div>

        <div className='w-full mt-20 flex flex-col gap-2'>
          <p>Jobs Posted</p>

          {/* <div className='flex flex-wrap gap-3'>
            {jobs?.map((job, index) => {
              const data = {
                name: info?.name,
                email: info?.email,
                ...job,
              };
              return <JobCard job={data} key={index} />;
            })}
          </div> */}
         <div className='flex flex-wrap gap-3'>
            {Array.isArray(jobs) ? (
              jobs.length > 0 ? (
                jobs.map(job => <JobCard key={job.id} job={{ ...job, companyInfo }} />)
              ) : (
                <p>No jobs found.</p>
              )
            ) : (
              <p>Error: Jobs data is not an array.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyProfile;




// const getCompanyProfile = async () => {
//   try {
//     const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/company-profile-get/', {
//       headers: {
//         Authorization: `Bearer ${jwt_access}`
//       }
//     });
//     setCompanyInfo(response.data,"This is responeded data checkkk");
//     setIsLoading(false);
//   } catch (error) {
//     console.error('Error fetching company profile:', error);
//     setIsLoading(false);
//   }
// };


// useEffect(() => {
//   if (!jwt_access && !user) {
//     navigate("/login");
//   } else {
//     getSomeData();
//   }
// }, [jwt_access, user, navigate]);

// useEffect(() => {
//   console.log(jwt_access,"llllllllllllllllllllllllllll")
//   if (jwt_access) {
//     axios.get('http://127.0.0.1:8000/api/v1/auth/company-profile/', {
//       headers: {
//         Authorization: `Bearer ${jwt_access}`
//       }
//     })
//       .then(response => setCompanyInfo(response.data))
//       .catch(error => console.error('Error fetching company profile:', error));
//   }
// }, [jwt_access]);

// const refreshToken = async () => {
//   try {
//     const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/token/refresh/', { refresh: jwt_refresh });
//     localStorage.setItem('access', response.data.access);
//     return response.data.access;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     handleLogout();
//   }
// };

// axiosInstance.post('http://localhost:8000/api/v1/auth/company-profile/', formData, {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//     'Authorization': `Bearer ${jwt_access}` // Adjust based on your auth implementation
//   }
// })
