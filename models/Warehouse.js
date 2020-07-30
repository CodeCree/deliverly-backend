const mongoose = require("mongoose");
const addressSchema = require("./Address");
var address = addressSchema.schema;

const warehouseSchema = new mongoose.Schema({
    // Coords are numbers like -104963 in the server, on client side it willbe made into -104.963
    address: {
        type: address,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
}, { collection: "Warehouses" });

module.exports = mongoose.model("Warehouse", warehouseSchema);