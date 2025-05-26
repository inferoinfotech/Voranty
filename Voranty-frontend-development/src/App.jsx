import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/style.css";
import ProtectedRoute from "./providers/ProtectedRoute";
import Error404 from "./pages/404/Error404";
import Loader from "./components/Loader/Loader";
import TermsConditions from "./pages/Landing/PrivacyPolicy";

const Register = lazy(() => import("./pages/Auth/Register/Register.jsx"));
const Login = lazy(() => import("./pages/Auth/Login/Login.jsx"));
const Forgotpassword = lazy(() => import("./pages/Auth/ForgetPassword/ForgotPass.jsx"));
const Otp = lazy(() => import("./pages/Auth/OTP/Otp.jsx"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword/ResetPass.jsx"));
const Expenses = lazy(() => import("./pages/Dashboard/Expenses/Expenses.jsx"));
const Layout = lazy(() => import("./pages/Dashboard/Layout/Layout"));
const Reports = lazy(() => import("./pages/Dashboard/Reports/Reports"));
const Insights = lazy(() => import("./pages/Dashboard/Insights/Insights"));
const AccountDetails = lazy(() => import("./pages/Dashboard/Settings/AccountDetails"));
const Preferences = lazy(() => import("./pages/Dashboard/Settings/Preferences"));
const ReportDetail = lazy(() => import("./pages/Dashboard/ReportDetail/ReportDetail"));
const Home = lazy(() => import("./pages/Dashboard/Home/Home"));
const LandingPage = lazy(() => import("./pages/Landing/Landing.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<Forgotpassword />} />
          <Route path="/resetPassword/:userId" element={<ResetPassword />} />
          <Route path="/otp/:userId" element={<Otp />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/privacy-policy" element={<TermsConditions />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={  
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="insights" element={<Insights />} />
            <Route path="settings/accountDetails" element={<AccountDetails />} />
            <Route path="settings/preferences" element={<Preferences />} />
            <Route path="reportdetails/:id" element={<ReportDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
