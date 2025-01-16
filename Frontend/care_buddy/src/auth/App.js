import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import store from "../store";
import { Provider } from "react-redux";
import "../../src/App.css";
import Appointments from "../pages/Appointments";
import Earnings from "../pages/Earnings";
import Availability from "../pages/Availability";
import Patients from "../pages/Patients";
const Login = React.lazy(() => import("./Login"));
const Home = React.lazy(() => import("../pages/Home"));
const NotFound = React.lazy(() => import("../NotFound"));

const App = () => (
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
          {/* Navbar remains fixed at the top */}
          <ProtectedRoute>
            <Navbar />
          </ProtectedRoute>

          {/* Routes and additional components are rendered below the Navbar */}
          <div className="mt-32 px-10">
            <Routes>
              <Route path="/login" element={<Login />} />
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
                path="/earnings"
                element={
                  <ProtectedRoute>
                    <Earnings />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/availability"
                element={
                  <ProtectedRoute>
                    <Availability/>
                  </ProtectedRoute>
                }
              />

<Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <Patients/>
                  </ProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);

export default App;
