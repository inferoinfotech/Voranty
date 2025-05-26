const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        Title: {
            type: String,
        },
        Category: {
            type: String,
        },
        Total_Ammount: {
            type: Number,
        },
        Expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense'
        },
        Description: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Comment:[{
            type: String,
        }]
    },
    { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;



