const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');


const auth = require("../middleware/authMiddleware");


// router.get('/export/:id', auth, reportController.exportData);

// router.post("/createreport", auth, reportController.creatreport)

router.get("/allget", auth, reportController.allget)

router.get("/getbyid/:id", auth, reportController.getbyid)

router.delete("/deletereport/:id", auth, reportController.deleteReport)

router.put("/addcomment/:id", auth, reportController.addcomment)

router.post("/export-csv", reportController.exportData);

module.exports = router;