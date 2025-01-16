import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { postData } from './Methods';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import '../components/css/login.css';
import * as Yup from 'yup';
import Logo from '../components/images/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { setAccessToken, setUser } = useContext(AuthContext);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        const resp = await postData('/auth/login', {
            email: values.username,
            password: values.password,
        });

        if (resp.name === 'AxiosError') {
            let errText = resp?.response?.data?.errors;
            setErrors({ general: errText });
        } else {
            setUser(resp.data.user);
            setAccessToken(resp.data.accessToken);
            navigate('/');
        }
        setSubmitting(false);
    };

    const handleForgotPassword = async (values, { setSubmitting, setErrors }) => {
        const resp = await postData('/auth/forgot-password', { email: values.email });
        if (resp.name === 'AxiosError') {
            setErrors({ email: resp.response.data.errors });
        } else {
            alert('Password reset instructions have been sent to your email.');
            setIsForgotPassword(false); // Switch back to login form
        }
        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().when('isForgotPassword', {
            is: false,
            then: Yup.string().required('Username is required'),
        }),
        password: Yup.string().when('isForgotPassword', {
            is: false,
            then: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
                .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character (!@#$%^&*)'),
        }),
        email: Yup.string().when('isForgotPassword', {
            is: true,
            then: Yup.string()
                .email('Invalid email address')
                .matches(
                    /^[a-zA-Z0-9._%+-]+@globalsurveysolutions\.com$/,
                    'Email must end with @globalsurveysolutions.com'
                )
                .required('Email is required'),
        }),
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg flex h-[80vh] min-h-[400px] overflow-hidden">
                {/* Left Section */}
                <div className="w-1/2 bg-blue-500 loginLeft text-white flex flex-col items-center p-2">
                    <img className="max-w-28 rounded mt-12" src={Logo} alt="Logo" />
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-lg text-center p-4">
                        Sign in to continue and explore more features of Care Buddy.
                    </p>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        {isForgotPassword ? 'Forgot Password' : 'Sign in'}
                    </h2>
                    <Formik
                        initialValues={{ username: '', password: '', email: '' }}
                        validationSchema={validationSchema}
                        onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
                        enableReinitialize={true} // Ensures the form resets properly
                    >
                        {({ isSubmitting, errors }) => (
                            <Form>
                                {errors.general && (
                                    <div className="text-red-500 text-sm mb-4" aria-live="assertive">
                                        {errors.general}
                                    </div>
                                )}

                                {!isForgotPassword && (
                                    <>
                                        <div className="mb-4">
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

                                        <div className="mb-4">
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

                                        <button
                                            type="submit"
                                            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 loginBtn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Logging in...' : 'Login'}
                                        </button>
                                        <div className="text-center mt-4">
                                            <span
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => setIsForgotPassword(true)}
                                            >
                                                Forgot Password?
                                            </span>
                                        </div>
                                    </>
                                )}

                                {isForgotPassword && (
                                    <>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                className="block text-gray-700 font-medium mb-2"
                                            >
                                                Enter your email
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

                                        <button
                                            type="submit"
                                            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 forgotBtn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending reset email...' : 'Send Reset Email'}
                                        </button>
                                        <div className="text-center mt-4">
                                            <span
                                                className="text-blue-500 cursor-pointer"
                                                onClick={() => setIsForgotPassword(false)}
                                            >
                                                Back to Login
                                            </span>
                                        </div>
                                    </>
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
