const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    // Coords are numbers like -104963 in the server, on client side it willbe made into -104.963
    warehouse: {
        type: String,
        required: false
    },
    route: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    at: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Event", eventSchema);