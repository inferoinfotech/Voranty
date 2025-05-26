
import { useState } from "react";
import "./forgotPass.css";
import RG from "../../../assets/images/cover/Forgot password-amico (1).png";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../../Service/Api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from '../../../components/Button/CustomButton';

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const result = await sendOtp(email);
      // console.log("API Response:", result);

      if (result.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");

        const userId = result.userId;
        // console.log("User ID:", userId);

        setTimeout(() => {
          navigate(`/otp/${userId}`);
        }, 2000);
      } else {
        toast.error(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.log("Error sending OTP:", err);
      toast.error("Error sending OTP. Please try again.");
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
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-sm text-gray-600" style={{ marginTop: "0px" }}>
                  Enter your email and we’ll send you an OTP to reset your password.
                </p>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              
                <CustomButton onClick={handleSendOtp}>
                {otpSent ? "OTP Sent!" : "Send OTP"}
                </CustomButton>
              </div>
            </div>

            {/* Right Side - Carousel */}
            <div className=" md:block">
              <div className=" relative">
                <img src={RG} alt="Right Side Image" className="ml-14 w-80" />
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

export default ForgotPass;
