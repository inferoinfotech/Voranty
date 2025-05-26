const { cloudinary } = require('../utils/Cloudinary');
const Report = require("../models/reportModel")
const { sendWarrentyReminderEmail } = require("../utils/mailReminderUtils");
const { sendWarrentyReminderSMS } = require("../utils/smsReminderUtils");
const Expense = require("../models/Expense");
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const path = require("path");
// const { parse } = require("date-fns");
const mongoose = require("mongoose");
const client = require('../utils/redis'); // Import the Redis client
const { parse, isValid } = require("date-fns");

module.exports.createExpense = async (req, res) => {

  try {
    const { userId, merchant, amount, date, warrentyDate, description, category, reimbursable } = req.body;
    const file = req.file;

    console.log(merchant, amount, date, warrentyDate, description, category, reimbursable);

    if (!userId || !merchant || !amount || !date ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let receiptImageUrl = null;
    let publicId = null;

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "expenses",
      });
      receiptImageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const newExpense = new Expense({
      user: userId,
      merchant,
      amount,
      date,
      warrentyDate,
      description,
      category,
      reimbursable,
      imageUrl: receiptImageUrl, 
      publicId: publicId, 
    });

    await newExpense.save();

    const body = {}
    if (req.body) {
      body.Title = date,
      body.Category = category,
      body.Total_Ammount = amount,
      body.Expense = newExpense._id,
      body.Description = description,
      body.user = userId
    }
    const creatreport = await Report.create(body)
    const expe = await Expense.findByIdAndUpdate({ _id: newExpense._id }, {
      $push: { Report: creatreport._id }
    }, { new: true })
    
    res.status(201).json({ message: "Expense created successfully", newExpense, expe });
  } catch (error) {
    console.error("Error creating expense:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.getExpenses = [async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user?.id });
    if (!expenses.length) {
      return res.status(404).json({ message: "No expenses found", expenses: [] });
    }
    
    // Cache the response
    const key = req.user?.id || req.url;
    await client.set(key, JSON.stringify(expenses), 'EX', 3600); // Cache for 1 hour

    res.status(200).json({ message: "Expenses fetched", expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}];

module.exports.getExpenseById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense retrieved successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports.updateExpense = async (req, res) => {
  let { id } = req.params;
  
  let { merchant, amount, date, warrentyDate, description, category, reimbursable, imageUrl } = req.body;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    let expense = await Expense.findByIdAndUpdate(
      { _id: id },  
      { merchant, amount, date, warrentyDate, description, category, reimbursable, imageUrl },
      { new: true }   
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(201).json({ message: "Your expense updated", expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.Report) {
      await Report.findByIdAndDelete(expense.Report);
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: "Expense and associated report deleted successfully" , deletedExpense});
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.multiCreateExpenses = async (req, res) => {
  try {
    let expensesArray;

    try {
      expensesArray = req.body.expenses.map((expenseString) => JSON.parse(expenseString));
    } catch (parseError) {
      throw new Error("Invalid expenses data format.");
    }

    const createdExpenses = await Promise.all(
      expensesArray.map(async (expense, index) => {
        const file = req.files.find((f) => f.fieldname === `file_${index}`);
        let uploadedFile = {};

        if (file) {
          uploadedFile = await cloudinary.uploader.upload(file.path, {
            folder: "expenses",
          });
        }

        const newExpense = new Expense({
          user: req.user.id, 
          date: expense.date,
          warrentyDate: expense.warrentyDate,
          merchant: expense.merchant,
          amount: expense.total,
          category: expense.category,
          description: expense.description,
          imageUrl: uploadedFile.secure_url || null,
          publicId: uploadedFile.public_id || null,
        });

        await newExpense.save();

        if (expense) {
          const reportData = {
            Title: expense.date,
            Category: expense.category,
            Total_Ammount: expense.total,
            Expense: newExpense._id,
            Description: expense.description,
            user: req.user.id,
          };
          const creatreport = await Report.create(reportData);
          await Expense.findByIdAndUpdate(
            { _id: newExpense._id },
            { $push: { Report: creatreport._id } },
            { new: true }
          );
        }

        return newExpense;
      })
    );

    res.status(201).json({
      message: "Expenses created successfully",
      expenses: createdExpenses,
    });
  } catch (error) {
    console.error("Error creating expenses:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports.deleteMultipleExpenses = async (req, res) => {
  const { ids } = req.body;

  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided or invalid format." });
    }


    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid ID format: ${id}` });
      }
    }

    const expenses = await Expense.find({ _id: { $in: ids } });
    const reportIds = expenses.map(expense => expense.Report).filter(Boolean);
    await Report.deleteMany({ _id: { $in: reportIds } });

    const deletedMultipleExpenses = await Expense.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Expenses and associated reports deleted successfully." , deletedMultipleExpenses});
  } catch (error) {
    console.error("Error deleting expenses:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.DueDateReminderExpense = async (req, res) => {
  const  userId  = req.user.id; 
  const { email, phoneNumber } = req.body; 

  console.log("User ID:", userId);
  console.log("Email:", email, "Phone:", phoneNumber);

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "Invalid user ID format." });
    }

    const userExpenses = await Expense.find({ user: userId });

    if (userExpenses.length === 0) {
      return res.status(404).send({ message: "No expenses found for the user." });
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueExpenses = userExpenses.filter((expense) => {
      const dueDateObj = new Date(expense.warrentyDate);
      dueDateObj.setHours(0, 0, 0, 0); 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      let i = [1, 2, 3, 4, 5, 6, 7];
      for (const daysBefore of i) {
        const reminderDate = new Date(dueDateObj);
        reminderDate.setDate(dueDateObj.getDate() - daysBefore);
    
        if (today.getTime() === reminderDate.getTime()) {
          return true; 
        }
      }
      return false; 
    });

    console.log("Due Expenses:", dueExpenses);
    
    if (dueExpenses.length === 0) {
      return res.status(200).send({ message: "No reminders needed today." });
    }

    console.log("Due Expenses:", dueExpenses);

    for (const expense of dueExpenses) {
      const { warrentyDate, description } = expense;

      await sendWarrentyReminderEmail(email, warrentyDate, description);

      console.log(`Reminder sent for Expense ID: ${expense._id}, Description: ${description}`);
    }

    res.status(200).send({ message: "Reminders sent successfully!", dueExpenses });
  } catch (error) {
    console.error("Error sending reminders:", error);
    res.status(500).send({ error: "Internal server error." });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).array("csvFiles", 49);

module.exports.importExpenseData = async (req, res) => {
  upload(req, res, async (err) => {
    console.log(req.files);
    
    if (err) {
      return res.status(400).json({ message: "Error uploading files", error: err });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = [];
    const expectedFields = ["merchant", "amount", "date", "warrentyDate", "description", "category"];

    try {
      for (const file of req.files) {
        await new Promise((resolve, reject) => {
          const fileResults = [];
          fs.createReadStream(file.path)
            .pipe(csv())
            .on("headers", (headers) => {
              const sanitizedHeaders = headers.map((header) => header.trim().replace(/\uFEFF/, ""));
              const extraHeaders = sanitizedHeaders.filter((header) => !expectedFields.includes(header));
              const missingHeaders = expectedFields.filter((field) => !sanitizedHeaders.includes(field));

              if (extraHeaders.length > 0 || missingHeaders.length > 0) {
                return reject({
                  message: "Invalid file format.",
                  extraHeaders,
                  missingHeaders,
                });
              }
            })
            .on("data", (data) => {
              const sanitizedData = {};
              expectedFields.forEach((field) => {
                sanitizedData[field] = data[field];
              });
              fileResults.push(sanitizedData);
            })
            .on("end", () => {
              results.push(...fileResults);
              resolve();
            })
            .on("error", (error) => reject(error));
        });
      }

      for (const record of results) {
        // Convert date strings to actual Date objects
        const parsedDate = parse(record.date, "M/d/yyyy", new Date());
        const parsedWarrentyDate = parse(record.warrentyDate, "M/d/yyyy", new Date());

        if (!isValid(parsedDate) || !isValid(parsedWarrentyDate)) {
          throw new Error(`Invalid date format in record: ${JSON.stringify(record)}`);
        }

        const newExpense = new Expense({
          user: req.user.id,
          merchant: record.merchant,
          amount: record.amount,
          date: parsedDate,
          warrentyDate: parsedWarrentyDate,
          description: record.description,
          category: record.category,
        });

        await newExpense.save();

        const reportData = {
          Title: record.date,
          Category: record.category,
          Total_Ammount: record.amount,
          Expense: newExpense._id,
          Description: record.description,
          user: req.user.id,
        };

        const createdReport = await Report.create(reportData);
        await Expense.findByIdAndUpdate(
          { _id: newExpense._id },
          { $push: { Report: createdReport._id } },
          { new: true }
        );
      }

      res.status(200).json({ message: "Data imported and reports created successfully!" });
    } catch (error) {
      console.error("Error importing data:", error);
      res.status(500).json({ message: "Error importing data", error });
    }
  });
};