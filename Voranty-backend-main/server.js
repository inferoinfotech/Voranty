const express = require("express");
const app = express(); 

const path = require("path");
const connectDB = require("./config/db");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// app.use(bodyParser.json());

const dotenv = require("dotenv");
require('dotenv').config();

const cors = require('cors');
app.use(cors({
  origin: ['https://voranty.vercel.app' , 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/warrentyRoutes"));
// app.use("/users", require("./routes/BillPaymentRoute"));
app.use("/users", require("./routes/reportRoute"));
app.use("/users", require("./routes/expenseRoutes"));
app.use("/users", require("./routes/expenseruleRoute"));
app.use("/ai", require("./routes/aiRoute"));

connectDB();
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Node.js and Express Server!</h1>");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
