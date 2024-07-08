import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Header from "../components/Header";
import { experience, jobTypes, jobs } from "../../../src/utils/data"
import CustomButton from "./Custombutton";
import ListBox from "./ListBox";
import axios from "axios";
import JobCard from "./JobCard";
import SearchHeader from "./SearchHeader";
import { useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Footer from "./Footer";


const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);



  const [isFetching, setIsFetching] = useState(false);

  // const location = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');





  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/v1/auth/api/jobs/?page=${currentPage}&job_title=${searchTitle}&job_location=${searchLocation}`);
        console.log("API Response:", response.data);
        setJobs(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); 
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, [currentPage, searchTitle, searchLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTitle(searchQuery);
    setSearchLocation(location);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (

    <div>
      <Header />
      <SearchHeader
  title='Find Your Dream Job with Ease'
  type='home'
  handleClick={handleSearch}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  location={location}
  setLocation={setLocation}
/>

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm'>
          <p className='text-lg font-semibold text-slate-600'>Filter Search</p>

          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2'>
              {jobTypes.map((jtype, index) => (
                <div key={index} className='flex gap-2 text-sm md:text-base '>
                  <input
                    type='checkbox'
                    value={jtype}
                    className='w-4 h-4'
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{jtype}</span>
                </div>
              ))}
            </div>
          </div>




          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Experience
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2'>
              {experience.map((exp) => (
                <div key={exp.title} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={exp?.value}
                    className='w-4 h-4'
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
              Shwoing: <span className='font-semibold'>1,902</span> Jobs
              Available
            </p>

            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className='w-full flex flex-wrap gap-4'>
            {jobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
          
          <div className='w-full flex items-center justify-center pt-16'>
          <Stack spacing={2}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Stack>
      </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FindJobs;