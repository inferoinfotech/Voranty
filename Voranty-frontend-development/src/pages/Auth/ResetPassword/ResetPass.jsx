import { useState, useEffect } from "react";
import "./resetpass.css";
import RG from "../../../assets/images/cover/Reset password-rafiki.png";
import { resetPassword, getUserDetails } from "../../../Service/Api/api";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from '../../../components/Button/CustomButton';


const ResetPass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // State to store user email
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const Navigate = useNavigate();
  const { userId } = useParams();


  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await getUserDetails(userId); // API call to fetch user details

        if (response.success) {
          setEmail(response.email); // Set email in state
        } else {
          toast.error("Failed to fetch user email."); 
        }
      } catch (err) {
        toast.error("Error fetching user details. Please try again."); 
      }
    };

    if (userId) {
      fetchUserEmail(); 
    }
  }, [userId]);


  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).+$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Both fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must contain 1 uppercase, 1 lowercase, and 1 special character.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword(userId, password);
      console.log(response);

      if (response.success) {
        toast.success("Password reset successfully.");
        setTimeout(() => {
          Navigate(`/login`);
        }, 2000);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("An error occurred while resetting the password.");
      console.log("Error resetting password:", err);
    }
  };

  return (
    <>  
    <div className="min-h-screen bg-img">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-4xl gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">
          {/* Left Side - Sign In Form */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-[40px] w-full items-center">
                <h1 className="text-2xl font-bold text-[#37B5FF]">VORANTY</h1>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600" style={{ marginTop: "0px" }}>
                Please Reset Your Password.
              </p>
            
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              {/* Confirm Password Input */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEye className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <FaEyeSlash className="text-gray-500 hover:text-gray-700" />
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
             
              <CustomButton onClick={handleResetPassword}>
              Reset Password
                </CustomButton>
            </div>
          </div>

          {/* Right Side - Carousel */}
          <div className=" md:block">
            <div className=" relative">
              <img src={RG} alt="Right Side Image" className="w-90" />
            </div>
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

export default ResetPass;
