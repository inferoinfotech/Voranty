const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");

const aicontroller = require("../controllers/aicontroller")


router.post('/scan-bill', upload.single('bill'), aicontroller.analyzeWithGemini);

module.exports = router;