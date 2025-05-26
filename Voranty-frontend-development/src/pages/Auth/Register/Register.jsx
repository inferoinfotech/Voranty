import { useState } from "react";
import "./register.css";
import RG from "../../../assets/images/cover/Sign up-rafiki.png";
import { UserDataRegistration, sendOtp, verifyOtp , sendRegisterOtp , verifyRegisterOtp} from "../../../Service/Api/api";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { auth, googleAuthProvider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import CustomButton from '../../../components/Button/CustomButton';
const baseUrl = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  
 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setAgreeTerms(false);
  };

  // Add email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate First Name
    if (!firstName.trim()) newErrors.firstName = "First name is required.";

    // Validate Last Name
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    // Enhanced email validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address (e.g., example@domain.com)";
    }

    // Validate Phone
    if (!phone.trim()) newErrors.phone = "Phone is required.";

    // Validate Password
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else {
      // Regex to check for at least 1 uppercase, 1 lowercase, and 1 special character
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).+$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = "Password must contain 1 uppercase, 1 lowercase, and 1 special character.";
      }
    }

    // Validate Terms Agreement
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms and conditions.";

    return newErrors;
  };

  // Optional: Add real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Regex to validate email format (must include '@' and end with '.com')
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

    if (value && !emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email must include '@' and end with '.com'",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const handlePassChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Validate password
    if (value && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must contain 1 uppercase, 1 lowercase, and 1 special character",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }

  };

  const handleRegister = () => {
    const validationErrors = validateForm();

    // If there are validation errors, set errors and show toast message
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill out all required fields correctly.");
      return; // Stop registration if there are errors
    }

    // If no errors, proceed with registration
    const registrationData = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Phone: phone,
      Password: password,
    };

    console.log("Sending registration data:", registrationData);

    // Call the registration API
    UserDataRegistration(
      registrationData,
      setRegistrationError,
      resetForm,
      navigate
    );
  };


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      const userData = {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1] || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "1425639685",
        profileImg: user.photoURL,
      };

      const response = await fetch(`${baseUrl}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login successful!");
        console.log("Backend response:", data);
        navigate("/home");
      } else {
        toast.error("Failed to log in.");
      }
    } catch (err) {
      console.log("Error during Google sign-in:", err);
      toast.error("An error occurred during login.");
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const result = await sendRegisterOtp(email);

      if (result.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.log("Error sending OTP:", err);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const result = await verifyRegisterOtp(email, otp);
      if (result.success) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
      } else {
        toast.error(result.message || "Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      console.log("Error verifying OTP:", err);
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const disabled = true; // or any logic to determine the disabled state

  return (
    <>
      <div className="min-h-screen bg-img sr overflow-y-scroll">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
          <div className="grid w-full max-w-4xl gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">
            {/* Left Side - Register Form */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2">
                <div className="flex h-[40px] w-full items-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#37B5FF]">VORANTY</h1>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Register Account
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Your data will be in INDIA data center.
                </p>

                {/* First Name Input */}
                <input
                  type="text"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`h-12 w-full px-4 border rounded-md focus:outline-none focus:ring-2 ${errors.firstName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                    }`}
                />


                {/* Last Name Input */}
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`h-12 w-full px-4 border rounded-md focus:outline-none focus:ring-2 ${errors.lastName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                    }`}
                />


                {/* Email Input */}
                <div className="flex items-center gap-2">
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={handleEmailChange}
                    className={`h-12 w-full px-4 border rounded-md focus:outline-none focus:ring-2 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  <CustomButton onClick={handleSendOtp} className="ml-2" disabled={!email}>
                     OTP
                  </CustomButton>
                </div>

                 {/* Enter OTP */}
                 <div className="flex items-center gap-2">
                   <input
                     type="text"
                     placeholder="Enter OTP"
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     className={`h-12 w-full px-4 border rounded-md focus:outline-none focus:ring-2 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                   
                   />
                   <CustomButton onClick={handleVerifyOtp} disabled={!otp}>
                     Verify 
                   </CustomButton>
                 </div>

                {/* Phone Input */}
                <input
                  name="phone"
                  type="number"
                  placeholder="Enter Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`h-12 w-full px-4 border rounded-md focus:outline-none focus:ring-2 ${errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                    }`}
                />


                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={handlePassChange}
                    className={`h-12 w-full px-4 pr-10 border rounded-md focus:outline-none focus:ring-2 ${errors?.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {/* Eye Icon */}
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEye className="text-gray-500 hover:text-gray-700" />
                    ) : (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-700" />
                    )}
                  </div>
                </div>
                {/* Error Message */}
                {errors?.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}


                {/* Terms and Conditions Checkbox */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-gray-600 text-sm">
                    I agree to the 
                    <Link to="/privacy-policy"><span className="text-blue-500"> Terms of Service</span></Link> and 
                    <span className="text-blue-500"> Privacy Policy</span>.
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-sm text-red-500">{errors.agreeTerms}</p>
                )}

                {/* Register Button */}
                <CustomButton onClick={handleRegister} status={!otpVerified}>
                  Register
                </CustomButton>
                {registrationError && (
                  <p className="text-sm text-red-500 mt-2">{registrationError}</p>
                )}

                {/* Login Link */}
                <div className="text-center text-sm sm:text-base">
                  {"Already have an account? "}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Login now
                  </Link>
                </div>

                {/* Google Sign Up Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 justify-center p-2 w-1/2 
                      relative overflow-hidden group
                      border border-gray-300 rounded-md
                      transition-all duration-300 ease-in-out
                      hover:border-gray-400 hover:bg-gray-50
                      hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                      active:scale-[0.98]"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span className="font-medium text-gray-600 group-hover:text-gray-800">
                      <span className="hidden sm:inline">Sign in with </span>
                      Google
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="md:block hidden">
              <img
                src={RG}
                alt="Right Side Image"
                className="w-full h-full object-cover"
              />

            </div>
          </div>
        </div>
      </div>

      <div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Register;