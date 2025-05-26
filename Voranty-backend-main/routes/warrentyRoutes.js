const express = require('express');
const router = express.Router();
const WarrantyController = require('../controllers/warrentyController');
const auth = require("../middleware/authMiddleware");


router.post("/createWarranty", auth, WarrantyController.createWarranty);

router.get("/getAllWarrantys", auth, WarrantyController.getAllWarrantys);

router.get("/getWarranty/:id", auth, WarrantyController.getWarrantyById);

router.put("/updateWarranty/:id", auth, WarrantyController.updateWarranty);

router.delete("/deleteWarranty/:id", auth, WarrantyController.deleteWarranty);

router.get("/DueDateReminderWarrenty/:id", auth, WarrantyController.DueDateReminderWarrenty)


module.exports = router;