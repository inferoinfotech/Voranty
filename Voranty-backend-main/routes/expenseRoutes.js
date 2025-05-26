const express = require("express");
const router = express.Router();
const upload = require("../utils/multerUtils");
const authMiddleware = require("../middleware/authMiddleware");
const ExpenseController = require("../controllers/expenseController") 


router.post("/create" ,upload.single("file"), ExpenseController.createExpense);

router.get("/get",authMiddleware, ExpenseController.getExpenses);

router.get("/get/:id", ExpenseController.getExpenseById);

router.put("/update/:id", ExpenseController.updateExpense);   

router.delete("/delete/:id", ExpenseController.deleteExpense);

router.post('/importExpense', authMiddleware, ExpenseController.importExpenseData); 

router.post("/multiCreate",authMiddleware, upload.any(), ExpenseController.multiCreateExpenses)

router.post("/deleteMultipleExpenses", ExpenseController.deleteMultipleExpenses)

router.post("/DueDateReminderExpense",authMiddleware, ExpenseController.DueDateReminderExpense)

module.exports = router;
