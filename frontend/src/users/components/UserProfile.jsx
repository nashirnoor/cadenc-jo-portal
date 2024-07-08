import React from 'react';
import Header from './Header';
import Footer from './Footer';

const UserProfile = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 flex items-start justify-center p-4">
        <div className="w-full max-w-[1120px] h-auto sm:h-[271px] bg-white rounded-xl shadow-lg flex flex-col sm:flex-row overflow-hidden">
          {/* Left side - Profile Photo */}
          <div className="w-full sm:w-[271px] h-[271px] bg-gray-200 flex-shrink-0 flex items-center justify-center p-4">
            <div className="w-48 h-48 rounded-full border-4 border-indigo-500 overflow-hidden">
              <img
                src="/path-to-your-image.jpg"
                alt="Profile Photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Middle section - Name, Position, Education, Contact Info */}
          <div className="flex-grow p-6 sm:p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">John Doe</h2>
            <p className="text-xl text-indigo-600 mb-4">Senior Software Engineer</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-gray-700">B.S. in Computer Science, XYZ University</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">5 years of experience</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">+1 (123) 456-7890</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">johndoe@example.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Right section - Skills */}
          <div className="w-full sm:w-[300px] bg-gray-50 p-6 sm:p-8 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'Python', 'JavaScript', 'SQL', 'Git'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-100 flex items-start justify-center p-4">
        <div className="w-full max-w-[1120px] bg-white rounded-xl shadow-lg p-8 relative">
          <div className="absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
          <p className="text-gray-600">
            Experienced software engineer with a passion for creating efficient and scalable web applications.
            Skilled in full-stack development with a focus on React and Node.js. Always eager to learn new technologies
            and contribute to innovative projects.
          </p>
        </div>
      </div>
      {/* Experience Section */}
      <div className="bg-gray-100 flex items-start justify-center p-4">
  <div className="w-full max-w-[1120px] bg-white rounded-xl shadow-lg p-8 relative">
  <div className="absolute top-4 right-4">
  <button 
    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex items-center justify-center transition duration-300 ease-in-out shadow-md" 
    title="Add Experience"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  </button>
</div>

    <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
    <div className="space-y-8">
      {[
        {
          company: 'Tech Solutions Inc.',
          position: 'Senior Software Engineer',
          startDate: 'Jan 2020',
          endDate: 'Present',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          responsibilities: [
            'Led the development team in creating a scalable e-commerce platform using React and Node.js.',
            'Implemented CI/CD pipelines to streamline the deployment process and reduce downtime.',
            'Mentored junior developers and conducted code reviews to ensure code quality.',
          ],
        },
        {
          company: 'Web Innovators',
          position: 'Software Developer',
          startDate: 'Jun 2016',
          endDate: 'Dec 2019',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          responsibilities: [
            'Developed and maintained web applications using JavaScript, HTML, and CSS.',
            'Collaborated with cross-functional teams to design and implement new features.',
            'Participated in daily stand-ups and sprint planning meetings to ensure timely project delivery.',
          ],
        },
      ].map((experience, index) => (
        <div key={index} className="space-y-2 relative bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="absolute top-4 right-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full p-2 transition duration-300 ease-in-out" title="Edit Experience">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{experience.position}</h3>
          <p className="text-gray-600">{experience.company} | {experience.startDate} - {experience.endDate}</p>
          <p className="text-gray-600">{experience.location} | {experience.jobType}</p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            {experience.responsibilities.map((responsibility, idx) => (
              <li key={idx} className="mt-1">{responsibility}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Education Section */}
      <div className="bg-gray-100 flex items-start justify-center p-4">
        <div className="w-full max-w-[1120px] bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Education</h2>
          <div className="space-y-8">
            {[
              {
                school: 'XYZ University',
                degree: 'B.S. in Computer Science',
                startDate: 'Sep 2012',
                endDate: 'May 2016',
                location: 'San Francisco, CA',
              },
              {
                school: 'ABC College',
                degree: 'A.A. in Information Technology',
                startDate: 'Sep 2010',
                endDate: 'May 2012',
                location: 'San Francisco, CA',
              },
            ].map((education, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">{education.degree}</h3>
                <p className="text-gray-600">{education.school} | {education.startDate} - {education.endDate}</p>
                <p className="text-gray-600">{education.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
