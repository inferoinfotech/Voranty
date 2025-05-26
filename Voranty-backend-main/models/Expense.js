const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    merchant: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    warrentyDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      default: null,
    },
    reimbursable: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    Report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    }
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;