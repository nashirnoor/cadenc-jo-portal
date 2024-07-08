import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EducationForm = ({ onSubmit, onSkip }) => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    university: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Final submission or navigation logic can be handled here
  };

  const handleSkip = () => {
    onSkip();
    // Final submission or navigation logic can be handled here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Education Information
    </h2>
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
            University
          </label>
          <input
            id="university"
            name="university"
            type="text"
            value={formData.university}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
            Degree
          </label>
          <input
            id="degree"
            name="degree"
            type="text"
            value={formData.degree}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <input
            id="field_of_study"
            name="field_of_study"
            type="text"
            value={formData.field_of_study}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-2"
        >
          Skip
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default EducationForm;
