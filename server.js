const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Loads environment variables
const dotenv = require("dotenv");
dotenv.config();

// Import routes
const defaultRoute = require("./routes/default");
const authRoute = require("./routes/auth");

// Connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("Connected to Mongo Atlas"));

// Express routes & etc.
app.use(express.json());
app.use("/api", defaultRoute);
app.use("/api/user", authRoute);

app.listen(3000, () => console.log("Express has started"));