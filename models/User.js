const mongoose = require("mongoose");
const addressSchema = require("./Address");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    organizations: {
        type: Array,
        required: false
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