// Setting up constants for libraries
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Import Routes
const authRoute = require("./app/routes/auth");

// Connecting to MongoDB Atlas
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to Mongo Atlas");
});

app.use(express.json());

// Route Middlewares
app.use("/api/user", authRoute);

app.listen(3000, () => {
    console.log("Express has been activated");
});