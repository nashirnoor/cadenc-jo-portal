import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const defaultImage = "/images/company-image-default.png";
  const companyLogo = job?.company_logo ? job.company_logo : defaultImage;
  const { title, description, companyInfo } = job;

  // const truncateText = (text, length) => {
  //   return text.length > length ? text.substring(0, length) + "..." : text;
  // };
  const truncateText = (text, length) => {
    if (!text) return ''; // Handle cases where text is undefined or null
    return text.length > length ? text.substring(0, length) + "..." : text;
  };
  

  return (
    // <Link to={`/job-detail/${job?.id}`}>
    <Link to={`/job-detail/${job.id}`}>

      <div
        className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 '
      >
        <div className='flex gap-3'>
          {companyInfo?.company_logo && (
            <div className='company-logo'>
              <img src={companyInfo.company_logo} alt="Company Logo" className='w-14 h-14 object-cover rounded-full' />
            </div>
          )}

          <div>
            <p className='text-lg font-semibold truncate'>{truncateText(job?.job_title, 15)}</p>
            <span className='flex gap-2 items-center'>
              <GoLocation className='text-slate-900 text-sm' />
              {job?.job_location}
            </span>
          </div>
        </div>

        <div className='py-3'>
          <p className='text-sm'>
            {job.job_description?.slice(0, 120).split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
            {job?.job_type}
          </p>
          <span className='text-gray-500 text-sm'>
            {moment(job?.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </Link>
  );
};



// const JobCard = ({ job }) => {
//   return (
//     <div className="job-card">
//       <h3>{job.job_title}</h3>
//       <p>Type: {job.job_type}</p>
//       <p>Salary: {job.salary}</p>
//       <p>Vacancies: {job.vacancies}</p>
//       <p>Experience: {job.experience}</p>
//       <p>Location: {job.job_location}</p>
//       <p>Description: {job.job_description}</p>
//       <p>Responsibilities: {job.core_responsibilities}</p>
//       <p>Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
//     </div>
//   );
// };


export default JobCard;