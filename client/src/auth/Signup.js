import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from './Methods';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../components/css/login.css'; // Assuming you reuse the same CSS
import Logo from '../components/images/logo.png';
import {alertSuccess} from '../components/Alert'

const Signup = () => {
    const navigate = useNavigate();
    const [isDoctor, setIsDoctor] = useState(false); // State to track if signing up as a doctor

    const handleSignup = async (values, { setSubmitting, setErrors }) => {
        const role = isDoctor ? 'doctor' : 'user'; // Set role based on the selected tab
        const payload = {
            email: values.email,
            password: values.password,
            confirmPassword:values.confirmPassword,
            username: values.username,
            role: role, // Dynamic role assignment
        };

        // Add doctor-specific fields if signing up as a doctor
        if (isDoctor) {
            payload.speciality = values.speciality;
            payload.experience = values.experience;
            payload.consultingFees = values.consultingFees;
        }

        const resp = await postData('/auth/signup', payload);

        if (resp.name === 'AxiosError') {
            let errText = resp?.response?.data?.message;
            setErrors({ general: errText });
        } else {
            alertSuccess('Verification email sent to your email id. Please follow the instructions','success')
            setTimeout(()=>{
                navigate('/login'); // Redirect to login page after successful signup
            },3000)
        }
        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
            .matches(
                /(?=.*[!@#$%^&*])/,
                'Password must contain at least one special character (!@#$%^&*)'
            ),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'), // Ensure confirmPassword matches password
        speciality: Yup.string().when('isDoctor', {
            is: true,
            then: Yup.string().required('Speciality is required'),
        }),
        experience: Yup.number()
            .when('isDoctor', {
                is: true,
                then: Yup.number()
                    .required('Experience is required')
                    .positive('Experience must be a positive number')
                    .integer('Experience must be a whole number'),
            }),
        consultingFees: Yup.number()
            .when('isDoctor', {
                is: true,
                then: Yup.number()
                    .required('Consulting Fees are required')
                    .positive('Consulting Fees must be a positive number'),
            }),
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg flex h-[90vh] min-h-[400px] overflow-hidden">
                {/* Left Section */}
                <div className="w-1/2 bg-blue-500 loginLeft text-white flex flex-col items-center justify-center">
                    <img className="max-w-28 rounded mt-12" src={Logo} alt="Logo" />
                    <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
                    <p className="text-lg text-center p-4">
                        Create an account to explore more features of Care Buddy.
                    </p>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Sign Up
                    </h2>

                    {/* Tabs for User/Doctor Signup */}
                    <div className="flex justify-center mb-6">
                        <button
                            className={`px-6 py-2 rounded-l-lg ${
                                !isDoctor
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => setIsDoctor(false)}
                        >
                            Signup as User
                        </button>
                        <button
                            className={`px-6 py-2 rounded-r-lg ${
                                isDoctor
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => setIsDoctor(true)}
                        >
                            Signup as Doctor
                        </button>
                    </div>

                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            speciality: '',
                            experience: '',
                            consultingFees: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSignup}
                        enableReinitialize={true}
                    >
                        {({ isSubmitting, errors }) => (
                            <Form>
                                {errors.general && (
                                    <div className="text-red-500 text-sm mb-4" aria-live="assertive">
                                        {errors.general}
                                    </div>
                                )}

                                {/* Username and Email in one row */}
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="username"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Username
                                        </label>
                                        <Field
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="Enter your username"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage
                                            name="username"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="email"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Email
                                        </label>
                                        <Field
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Password and Confirm Password in one row */}
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="password"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Password
                                        </label>
                                        <Field
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Enter your password"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Confirm Password
                                        </label>
                                        <Field
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            placeholder="Confirm your password"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Doctor-specific fields */}
                                {isDoctor && (
                                    <>
                                        {/* Speciality, Experience, and Consulting Fees in one row */}
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="speciality"
                                                    className="block text-gray-700 font-medium mb-2"
                                                >
                                                    Speciality
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="speciality"
                                                    id="speciality"
                                                    placeholder="Enter your speciality"
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="speciality"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="experience"
                                                    className="block text-gray-700 font-medium mb-2"
                                                >
                                                    Experience (in years)
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="experience"
                                                    id="experience"
                                                    placeholder="Enter your experience"
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="experience"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="consultingFees"
                                                    className="block text-gray-700 font-medium mb-2"
                                                >
                                                    Consulting Fees (in INR)
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="consultingFees"
                                                    id="consultingFees"
                                                    placeholder="Enter your fees"
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="consultingFees"
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 loginBtn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                                </button>

                                <div className="text-center mt-4">
                                    <span
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => navigate('/login')}
                                    >
                                        Already have an account? Login
                                    </span>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Signup;