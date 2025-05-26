import { useState, useEffect } from "react";
import "./otp.css";
import RG from "../../../assets/images/cover/Enter OTP-pana.png";
import { verifyOtp , getUserDetails  } from "../../../Service/Api/api"; 
import {  useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from '../../../components/Button/CustomButton';

const Otp = () => {
  const { userId } = useParams();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(""); // Store email fetched from the API
  const [successMessage, setSuccessMessage] = useState("");

  const Navigate = useNavigate();

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input automatically
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleBackspace = (index) => {
    if (index > 0 && otp[index] === "") {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

   // Fetch user email using the userId from the URL
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await getUserDetails(userId);
        // console.log("Response from getUserDetails:", response); 
        
      
        if (response.success) {
          setEmail(response.email);
          // console.log("Fetched email:", response.email); 
        } else {
          setError("Failed to fetch user email.");
        }
      } catch (err) {
        setError("Error fetching user details. Please try again.");
        console.log("Error fetching user details:", err); 
      }
    };

    if (userId) {
      fetchUserEmail();
    }
  }, [userId]); 


  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMessage("");
  
    // Check if OTP fields are filled
    if (otp.some((digit) => digit.trim() === "")) {
      setError("Please fill all OTP fields.");
      toast.error("Please fill all OTP fields.");  
      return;
    }
  
    const otpCode = otp.join(""); // Combine OTP digits into a single string
  
    try {
      const response = await verifyOtp(email, otpCode); // Call the verifyOtp API with email and OTP
      if (response.success) {
        setSuccessMessage("OTP verified successfully!");
        toast.success("OTP verified successfully!");  
        setTimeout(() => {
          Navigate(`/resetPassword/${userId}`);
        }, 2000); 
        setError("");
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
        toast.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      toast.error("Server error. Please try again later."); 
      console.log("Error verifying OTP:", err);
    }
  };
  
  
  return (
    <> 
    <div className="min-h-screen bg-img">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-4xl gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-[40px] w-full items-center">
              <h1 className="text-2xl font-bold text-[#37B5FF]">VORANTY</h1>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Enter OTP</h2>
              {email && (
                <p className="text-sm text-gray-600">
                  Please enter the 4-digit code sent to: <strong>{email}</strong>
                </p>
              )}
           

              <div style={{ display: "flex", gap: "10px" }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") handleBackspace(index);
                    }}
                    maxLength="1"
                    style={{
                      width: "50px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "20px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </div>
           
              <CustomButton onClick={handleVerifyOtp}>
              Verify OTP
                </CustomButton>
            </div>
          </div>

          <div className="md:block hidden">
            <div className="relative">
              <img src={RG} alt="Right Side Image" className="w-80 ml-10" />
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

export default Otp;
