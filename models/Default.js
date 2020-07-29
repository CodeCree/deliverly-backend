const mongoose = require("mongoose");

const defaultSchema = new mongoose.Schema({
    // Coords are numbers like -104963 in the server, on client side it willbe made into -104.963
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