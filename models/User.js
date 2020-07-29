const mongoose = require("mongoose");
const addressSchema = require("./Address");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, { collection: "Users" });

module.exports = mongoose.model("User", userSchema);