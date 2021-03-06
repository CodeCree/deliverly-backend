const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    // Coords are numbers like -104963 in the server, on client side it willbe made into -104.963
    coordinates: {
        type: [Number],
        required: false
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Address", addressSchema);