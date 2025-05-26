const mongoose = require("mongoose");
const WarrantySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        purchaseDate: {
            type: Date,
            required: true,
        },
        warrantyExpiryDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        }, 
  },
  { timestamps: true }
);
const Warranty = mongoose.model("Warranty", WarrantySchema);
module.exports = Warranty;