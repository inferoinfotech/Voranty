const User = require("../models/User");
const { sendEmail , transporter } = require("../utils/emailService");
const OtpGenrate = require("../utils/otpgenrate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { uploadFile } = require("../middleware/upload");
const mongoose = require("mongoose");
const { generateOTP } = require("../utils/otpgenrate");
// const dotenv = require("dotenv");
// require('dotenv').config();


const otpStore = new Map();

module.exports.register = async (req, res) => {
    try {
        const { FirstName, LastName, Email, Phone, Password } = req.body;
        const user = await User.findOne({ Email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' })

        }
        const bcpass = await bcrypt.hash(Password, 10)
        const body = {
            FirstName,
            LastName,
            Email,
            Phone,
            Password: bcpass
        }
        const creatuser = await User.create(body)
        return res.json({ msg: 'User registered successfully', creatuser })
    } catch (err) {
      console.error("Error during registration:", err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
};

  module.exports.login = async (req, res) => {
    try {
      const { Email, Password } = req.body;
  
      if (!Email || !Password) {
        return res.status(400).json({ msg: "Email and Password are required" });
      }
  
      const user = await User.findOne({ Email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id: user._id, Email: user.Email }, process.env.JWT_SECRET, {
        expiresIn: "1d", 
      });
  
      return res.json({
        msg: "Login successful",
        token,
        user: {
          id: user._id,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          Phone: user.Phone,
        },
      });
    } catch (err) {
      console.error("Error during login:", err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  };

  module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  

  try {
    const user = await User.findOne({ Email: email }).exec();
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    if (!user.OTP || !user.OTP.otp) {
      return res.status(400).json({ success: false, message: "OTP not found." });
    }

    const currentTime = new Date();
    if (currentTime > user.OTP.expiresAt) {
      user.OTP = null;  
      await user.save();
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }
    console.log(user.OTP.otp);
    

    if (otp === user.OTP.otp) {
      user.OTP = null; 
      await user.save();
      return res.json({ success: true, message: "OTP verified successfully." });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports.resendOTP = async (req, res) => {
    const Email = req.body.Email;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (!user.OTP || Date.now() > user.otpExpires) {
            const otp = OtpGenrate.generateOTP();
            user.OTP = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; 

            await user.save();
            await sendEmail(Email, "Password Reset OTP", `Your new OTP for password reset is: ${otp}`);
            res.status(200).json({ message: "New OTP sent to your email" });
        }
        else {
            return res.status(400).json({ message: "OTP is still valid. Please wait for it to expire." });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.Password = hashedPassword; 
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

  module.exports.getUserDetails = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true , phone: user.Phone, email: user.Email});
    } catch (err) {
      console.error("Error fetching user details:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  module.exports.getUserData = async (req, res) => {
    try {
      const user = req.user; 
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({
        success: true,
        user: {
          id: user._id,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          Phone: user.Phone,
          Photo: user.Photo,
        },
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  module.exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    
    try {
      const user = await User.findOne({ Email: email.trim() }).exec();

      
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found." });
      }
  
      const otp = Math.floor(1000 + Math.random() * 9000);  
  
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 
  
      user.OTP = {
        otp: otp.toString(),
        expiresAt: expiresAt,
      };
  
      await user.save();  
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.OTP_EMAIL, 
          pass: process.env.OTP_PASS,  
        },
      });
  
      const mailOptions = {
        from: process.env.OTP_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: "Error sending OTP." });
        }
  
        console.log("OTP sent: " + info.response);
        return res.json({
          success: true,
          message: "OTP sent successfully.",
          userId: user._id,
        });
      });
  
    } catch (err) {
      console.error("Error in sendOtp:", err);
      return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  };
  

  module.exports.sendRegisterOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Set OTP expiry (2 minutes)
        const expiresAt = Date.now() + 2 * 60 * 1000;

        // Store OTP in memory
        otpStore.set(email, { otp, expiresAt });

        console.log(`OTP for ${email}: ${otp}`); // Debugging

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.OTP_EMAIL, 
                pass: process.env.OTP_PASS,  
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.OTP_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It will expire in 2 minutes.`,
        };

        // Send OTP via email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Error sending OTP." });
            }

            console.log("OTP sent: " + info.response);
            return res.json({
                success: true,
                message: "OTP sent successfully.",
                expiresAt,
            });
        });

    } catch (err) {
        console.error("Error in sendOtp:", err);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  };

  module.exports.registerVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Check if OTP exists for the email
        if (!otpStore.has(email)) {
            return res.status(400).json({ success: false, message: "OTP not found." });
        }

        const storedOtp = otpStore.get(email);

        // Check if OTP is expired
        if (Date.now() > storedOtp.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        // Verify OTP
        if (otp === storedOtp.otp) {
            otpStore.delete(email); // Remove OTP after successful verification
            return res.json({ success: true, message: "OTP verified successfully." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

    } catch (err) {
        console.error("Error verifying OTP:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

  module.exports.updateUserProfile = async (req, res) => {
    try {
  
      const { FirstName, LastName, Phone } = req.body;
      const userId = req.user?.id; 
  
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is missing or invalid." });
      }
      if (!FirstName || !LastName || !Phone) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      user.FirstName = FirstName || user.FirstName;
      user.LastName = LastName || user.LastName;
      user.Phone = Phone || user.Phone;
  
      if (req.file && req.file.path) {
        user.Photo = req.file.path;
      }
  
      await user.save();
  
      res.json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: user._id,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Phone: user.Phone,
          Photo: user.Photo,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  };
  
  module.exports.googleLogin = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, profileImg } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let user = await User.findOne({ Email: email }).session(session);

            if (!user) {
                user = new User({
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Phone: phoneNumber,
                    Photo: profileImg,
                });

                await user.save({ session });
            }

            await session.commitTransaction();
            session.endSession();

            const token = jwt.sign(
                { id: user._id, email: user.Email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Email: user.Email,
                    Phone: user.Phone,
                    Photo: user.Photo,
                },
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            if (error.code === 11000) {
                return res.status(400).json({ error: "Duplicate entry detected. Please try again." });
            }
            throw error;
        }
    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
