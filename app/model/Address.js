const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

    street: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: false
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