const Expense = require("../models/Expense");
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const Report = require('../models/reportModel');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const { Parser } = require("json2csv");
const client = require('../utils/redis'); // Import the Redis client


module.exports.allget = [ async (req, res) => {
    try {
        const id = req.user.id;
        const reports = await Report.find({ user: id });
        
        // Cache the response
        const key = req.originalUrl || req.url;
        await client.set(key, JSON.stringify(reports), 'EX', 3600); // Cache for 1 hour

        res.json(reports);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}];

module.exports.getbyid = async (req, res) => {
    try {
        const reportid = req.params.id;
        const report = await Report.findById({ _id: reportid }).populate('Expense').exec();
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.deleteReport = async (req, res) => {
    try {
        const reportid = req.params.id;
        const report = await Report.findByIdAndDelete({ _id: reportid });
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.addcomment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const report = await Report.findById({ _id: id });
        if (!report) return res.status(404).json({ message: "Report not found" });
        const add = await Report.findByIdAndUpdate({ _id: report._id }, {
            $push: { Comment: comment }
        }, { new: true })
        res.status(200).json({ message:"comment successfully added" });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error });
    }
}


// module.exports.exportData = async (req, res) => {
//     const { expenseIds } = req.body;
  
//     if (!expenseIds || expenseIds.length === 0) {
//       return res.status(400).json({ error: "No expense IDs provided." });
//     }
  
//     try {
//       const selectedReports = await Report.find({ _id: { $in: expenseIds } });
  
//       if (selectedReports.length === 0) {
//         return res.status(404).json({ error: "No matching reports found." });
//       }
  
//       const detailedExpenses = await Promise.all(
//         selectedReports.map(async (report) => {
//           const expenseDetails = await Expense.findById(report.Expense);
//           // console.log(expenseDetails);

//           return {
//             date: `${new Date(expenseDetails.date).toLocaleDateString()}`,
//             category: report.Category,
//             amount: expenseDetails.amount,
//             description: report.Description,
//             merchant: expenseDetails?.merchant || "N/A", 
//             warrenty_Date: `${new Date(expenseDetails?.warrentyDate).toLocaleDateString()}` || expenseDetails?.warrentyDate || "N/A",
//           };
//         })
//       );
  
//       const fields = [
//         "date",
//         "category",
//         "amount",
//         "description",
//         "merchant",
//         "warrenty_Date", 
//       ];
//       const json2csvParser = new Parser({ fields });
  
//       const csvData = json2csvParser.parse(detailedExpenses);
  
//       res.header("Content-Type", "text/csv");
//       res.attachment("expenses.csv");
//       res.send(csvData);
//     } catch (error) {
//       console.error("Error generating CSV:", error);
//       res.status(500).json({ error: "Failed to generate CSV." });
//     }
//   };


module.exports.exportData = async (req, res) => {
  const { expenseIds } = req.body;

  if (!expenseIds || expenseIds.length === 0) {
    return res.status(400).json({ error: "No expense IDs provided." });
  }

  try {
    const selectedReports = await Report.find({ _id: { $in: expenseIds } });

    if (selectedReports.length === 0) {
      return res.status(404).json({ error: "No matching reports found." });
    }

    const detailedExpenses = await Promise.all(
      selectedReports.map(async (report) => {
        const expenseDetails = await Expense.findById(report.Expense);
        console.log(expenseDetails);
        return {
          date: `${new Date(report.Title).toLocaleDateString()}`,
          category: report.Category,
          amount: report.Total_Ammount,
          description: report.Description,
          merchant: expenseDetails?.merchant || "N/A", 
          warrentyDate: `${new Date(expenseDetails?.warrentyDate).toLocaleDateString()}` || expenseDetails?.warrentyDate || "N/A",
        };
      })
    );

    const fields = [
      "date",
      "category",
      "amount",
      "description",
      "merchant",
      "warrentyDate", 
    ];
    const json2csvParser = new Parser({ fields });

    const csvData = json2csvParser.parse(detailedExpenses);

    res.header("Content-Type", "text/csv");
    res.attachment("expenses.csv");
    res.send(csvData);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ error: "Failed to generate CSV." });
  }
};