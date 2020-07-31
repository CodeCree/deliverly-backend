const mongoose = require("mongoose");
const packageSchema = require("./Package");
var package = packageSchema.schema;
const breadcrumbSchema = require("./Package");
var breadcrumb = breadcrumbSchema.schema;

const routeSchema = new mongoose.Schema({

    "startedAt": {
        type: Date,
        required: false,
        default: null
    },
    "endedAt": {
        type: Date,
        required: false,
        default: null
    },
    userId: {
        type: String,
        requied: true
    },
    packages: {
        type: [package],
        required: false
    },
    "endWarehouse": {
        type: String,
        required: false
    },
    "tracking": {
        type: [breadcrumb],
        required: false
    }

}, { collection: "Routes" });

module.exports = mongoose.model("Route", routeSchema);