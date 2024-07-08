import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    photo: null,
    skills: [],
    resume: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'skills') {
      const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: selectedSkills });
    } else if (name === 'photo' || name === 'resume') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    history.push('/experience');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Profile Information
    </h2>
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <select
            id="skills"
            name="skills"
            multiple
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="skill1">Skill 1</option>
            <option value="skill2">Skill 2</option>
            {/* Add more options based on your Skill model */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            Resume
          </label>
          <input
            id="resume"
            name="resume"
            type="file"
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default UserProfileForm;
