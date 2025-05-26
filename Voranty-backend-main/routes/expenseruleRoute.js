const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const expenseruleController = require("../controllers/expenseruleController")



router.post("/createrule", authMiddleware, expenseruleController.rulecreate)
router.get("/getallrule", authMiddleware, expenseruleController.rulegetall)
router.put("/updaterule/:id", authMiddleware, expenseruleController.updaterule)
router.delete("/deleterule/:id", authMiddleware, expenseruleController.deleterule)


module.exports = router;