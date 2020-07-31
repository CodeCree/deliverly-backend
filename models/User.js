const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
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
    operator: {
        type: Boolean,
        required: false,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, { collection: "Users" });

module.exports = mongoose.model("User", userSchema);