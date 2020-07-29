const mongoose = require("mongoose");
const addressSchema = require("./Address");

const packageSchema = new mongoose.Schema({
    // Coords are numbers like -104963 in the server, on client side it willbe made into -104.963
    uuid: {
        // UUID v4 8-4-4-4-12 total of 36 characters
        type: String,
        min: 36,
        max: 36,
        required: true
    },
    warehouse: {
        type: String,
        required: true
    },
    weight: {
        // In kilograms
        type: Number,
        required: false
    },
    recipient: {
        type: String,
        required: true
    },
    address: {
        type: addressSchema,
        required: true
    }
}, { collection: "Packages" });

module.exports = mongoose.model("Package", packageSchema);