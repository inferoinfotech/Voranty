const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/multerUtils");
const auth_controller = require("../controllers/authController")

router.post("/register", auth_controller.register)

router.post("/login", auth_controller.login)

router.post("/sendOtp", auth_controller.sendOtp);

router.post("/sendRegisterOTP", auth_controller.sendRegisterOTP);

router.post("/verifyRegisterOtp", auth_controller.registerVerifyOtp);

router.post("/verifyOtp", auth_controller.verifyOtp); 

router.post('/resetPassword', auth_controller.resetPassword); 

router.post("/resendOTP", auth_controller.resendOTP);

router.get("/user/:userId", auth_controller.getUserDetails);

router.get("/getUser", authMiddleware, auth_controller.getUserData);

router.post("/google-login", auth_controller.googleLogin);

router.put("/updateUserProfile", authMiddleware,upload.single("Photo"), auth_controller.updateUserProfile);

module.exports = router;
