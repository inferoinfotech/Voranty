const mongoose = require("mongoose");

const expenseruleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    merchant: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Expenserule = mongoose.model("expenserule", expenseruleSchema);
module.exports = Expenserule;