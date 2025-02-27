import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";
import Navbar from "../components/Navbar";
import store from "../store";
import { Provider } from "react-redux";
import "../../src/App.css";
import Appointments from "../pages/Appointments";
import Earnings from "../pages/Earnings";
import Availability from "../pages/Availability";
import Patients from "../pages/Patients";
import BookAppointments from "../pages/BookAppointments";
import TakeAppointment from "../pages/TakeAppointment";
import Signup from "./Signup";
import VerifyEmail from "./VerifyEmail";
import ResetPassword from "./ResetPassword"
const Login = React.lazy(() => import("./Login"));
const Home = React.lazy(() => import("../pages/Home"));
const NotFound = React.lazy(() => import("../NotFound"));

const AppContent = () => {
  const location = useLocation();

  const isLoginRoute = location.pathname === "/login" || location.pathname === "/signup" || location.pathname==="/verify" || location.pathname==="/reset-password";

  return (
    <>
      {/* Conditionally render Navbar */}
      {!isLoginRoute && <Navbar />}

      {/* Conditionally apply wrapper class */}
      <div className={isLoginRoute ? "" : "mt-32 px-10"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointments"
            element={
              <ProtectedRoute>
                <BookAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointments/:doctorId"
            element={
              <ProtectedRoute>
                <TakeAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/earnings"
            element={
              <ProtectedRoute requiredRoles={['doctor']}>
                <Earnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/availability"
            element={
              <ProtectedRoute requiredRoles={['doctor']}>
                <Availability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />

          {/* Catch-All Route */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                Loading...
              </div>
            }
          >
            <AppContent />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
};

export default App;
