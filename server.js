// Setting up constants for libraries
const conf = require("./config.json");
const express = require("express"), app = express(), port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb").MongoClient;

// URL Encoding just for now
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app/routes/index.js is where all the routes are stored
require("./app/routes")(app, {});
app.listen(port, () => {
    console.log(`We are live on ${port}`);
});