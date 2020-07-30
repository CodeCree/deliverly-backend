const mongoose = require("mongoose");
const addressSchema = require("./Address");
var address = addressSchema.schema;

const packageSchema = new mongoose.Schema({
    customerCode: {
        type: String,
        required: true
    },
    qrHash: {
        // UUID v4 8-4-4-4-12 total of 36 characters
        type: String,
        min: 36,
        max: 36,
        required: false
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
        type: address,
        required: true
    }
}, { collection: "Packages" });

module.exports = mongoose.model("Package", packageSchema);