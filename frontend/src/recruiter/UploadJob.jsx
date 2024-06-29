import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import CustomButton from "../users/components/Custombutton";
import JobCard from "../users/components/JobCard";
import TextInput from "../users/components/TextInput";
import JobTypes from "./components/JobTypes";
import Header from "./RecruiterHeader";
import { useEffect } from "react";


const UploadJob = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState('');
  const [jobType, setJobType] = useState('full_time');
  const [jobs, setJobs] = useState([]);

  let jwt_access = localStorage.getItem('access');
  jwt_access = JSON.parse(jwt_access);

  console.log(jwt_access);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/auth/jobs/', {
        headers: {
          'Authorization': `Bearer ${jwt_access}`,
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/auth/jobs/create/',
        {
          job_title: data.jobTitle,
          job_type: jobType,
          salary: data.salary,
          vacancies: data.vacancies,
          experience: data.experience,
          job_location: data.job_location,
          job_description: data.job_description,
          core_responsibilities: data.core_responsibilities,
        },
        {
          headers: {
            'Authorization': `Bearer ${jwt_access}`,
          },
        }
      );
      toast.success('Job posted successfully!');
      console.log(response.data);
      fetchJobs(); // Fetch the updated list of jobs
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
      setErrMsg(error.response?.data?.message || 'An error occurred');
      toast.error('Failed to post the job.');
    }
  };

  return (
    <>
      <Header />
      <div className='container mx-auto flex flex-col md:flex-row gap-8 2xl:gap-14 bg-[#f7fdfd] px-5 mt-7'>
        <div className='w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md'>
          <div>
            <p className='text-gray-500 font-semibold text-2xl'>Job Post</p>
            <form className='w-full mt-2 flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                  name='jobTitle'
                  label='Job Title'
                  placeholder='eg. Software Engineer'
                  type='text'
                  required={true}
                  register={register('jobTitle', { required: 'Job Title is required' })}
                  error={errors.jobTitle ? errors.jobTitle?.message : ''}
                />  

              <div className='w-full flex gap-4'>
                <div className={`w-1/2 mt-2`}>
                  <label className='text-gray-600 text-sm mb-1'>Job Type</label>
                  <select
                    className='w-full rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2'
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option value='full_time'>Full-time</option>
                    <option value='part_time'>Part-time</option>
                    <option value='contract'>Contract</option>
                    <option value='intern'>Intern</option>
                  </select>
                </div>

                <div className='w-1/2'>
                  <TextInput
                    name='salary'
                    label='Salary (INR)'
                    placeholder='eg. 1500'
                    type='number'
                    register={register('salary', { required: 'Salary is required' })}
                    error={errors.salary ? errors.salary?.message : ''}
                  />
                </div>
              </div>

              <div className='w-full flex gap-4'>
                <div className='w-1/2'>
                  <TextInput
                    name='vacancies'
                    label='No. of Vacancies'
                    placeholder='vacancies'
                    type='number'
                    register={register('vacancies', { required: 'Vacancies is required!' })}
                    error={errors.vacancies ? errors.vacancies?.message : ''}
                  />
                </div>

                <div className='w-1/2'>
                  <TextInput
                    name='experience'
                    label='Years of Experience'
                    placeholder='experience'
                    type='number'
                    register={register('experience', { required: 'Experience is required' })}
                    error={errors.experience ? errors.experience?.message : ''}
                  />
                </div>
              </div>

              <TextInput
                name='location'
                label='Job Location'
                placeholder='eg. New York'
                type='text'
                register={register('job_location', { required: 'Job Location is required' })}
                error={errors.location ? errors.location?.message : ''}
              />

              <div className='flex flex-col'>
                <label className='text-gray-600 text-sm mb-1'>Job Description</label>
                <textarea
                  className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                  rows={4}
                  cols={6}
                  {...register('job_description', { required: 'Job Description is required!' })}
                  aria-invalid={errors.desc ? 'true' : 'false'}
                ></textarea>
                {errors.desc && (
                  <span role='alert' className='text-xs text-red-500 mt-0.5'>
                    {errors.desc?.message}
                  </span>
                )}
              </div>

              <div className='flex flex-col'>
                <label className='text-gray-600 text-sm mb-1'>Core Responsibilities</label>
                <textarea
                  className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                  rows={4}
                  cols={6}
                  {...register('core_responsibilities')}
                ></textarea>
              </div>

              {errMsg && (
                <span role='alert' className='text-sm text-red-500 mt-0.5'>
                  {errMsg}
                </span>
              )}

              <div className='mt-2'>
                <CustomButton
                  type='submit'
                  containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                  title='Submit'
                />
              </div>
            </form>
          </div>
        </div>
        
        <div className='w-full md:w-1/3 2xl:2/4 p-5 mt-20 md:mt-0'>
          <p className='text-gray-500 font-semibold'>Recent Job Post</p>
          <div className='w-full flex flex-wrap gap-6'>
            {jobs.slice(0, 4).map((job, index) => {
              return <JobCard job={job} key={index} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadJob;
