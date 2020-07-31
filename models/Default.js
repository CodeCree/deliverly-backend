const mongoose = require("mongoose");

const defaultSchema = new mongoose.Schema({

    array: {
        type: [Number],
        required: true
    },
    string: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Default", defaultSchema);