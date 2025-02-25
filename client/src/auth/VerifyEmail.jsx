import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from './api';
import { alertSuccess, alertError } from '../components/Alert';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // Extract the token from the query string
  const [redirecting, setRedirecting] = useState(false); // State to handle redirection message

  // Function to verify email
  const verify = async () => {
    try {
      const resp = await api.get(`/auth/verify-email/${token}`);
      alertSuccess(resp.data.message); // Show success message

      // Set redirection state to true
      setRedirecting(true);

      // Redirect to login after 5 seconds
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page
      }, 5000);
    } catch (err) {
      alertError(err.response.data.message); // Show error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
      <p className="text-gray-600 mb-6">
        Click the button below to verify your email address.
      </p>

      {/* Verify Email Button */}
      <button
        onClick={verify}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Verify Email
      </button>

      {/* Redirection Message */}
      {redirecting && (
        <p className="mt-4 text-gray-600">
          Email verified successfully! Redirecting to login in 5 seconds...
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;