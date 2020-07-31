const mongoose = require("mongoose");

const breadcrumbSchema = new mongoose.Schema({
    // Coords are numbers like -104963 in the server, on client side it willbe made into -104.963
    at: {
        type: Date,
        required: true
    },
    location: {
        type: [Number],
        required: true
    }
});

module.exports = mongoose.model("Breadcrumb", breadcrumbSchema);