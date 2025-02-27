import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import api from './api';
import { alertSuccess } from '../components/Alert';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate()
  // Extract the token from the query string
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Get the token after `?token=...`

  // State for form inputs and messages
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }


    try{
        const resp = await api.post(`/auth/reset-password/${token}`,{
              password:newPassword,
              confirmPassword:confirmPassword
        })
        alertSuccess('Password reset successfully!');
        setMessage('Password reset successfully!');
        setTimeout(()=>{
            navigate('/login')
        },5000)
    }catch(err){
        console.log(err)
        setMessage(err?.response?.data?.message || 'Failed to reset password.');
    }


  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
      {token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[var(--iconCol)] text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
      ) : (
        <p className="text-red-500 text-center">Invalid or missing token.</p>
      )}
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default ResetPassword;