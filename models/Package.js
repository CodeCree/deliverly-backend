const mongoose = require("mongoose");
const addressSchema = require("./Address");
var address = addressSchema.schema;

const packageSchema = new mongoose.Schema({
    code: {
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
        required: false
    },
    route: {
        type: String,
        required: false
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
    email: {
        type: String,
        required: true
    },
    address: {
        type: address,
        required: true
    },
    collect: {
        type: address,
        required: false
    },
    premium: {
        type: Date,
        required: false
    }
}, { collection: "Packages" });

module.exports = mongoose.model("Package", packageSchema);