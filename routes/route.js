const router = require("express").Router();
const addressModel = require("../models/Address");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const verifyOp = require("../functions/verifyTokenOp");
const geolocate = require("../functions/geolocate");

router.post("/route", verify, async (req, res) => {



});

module.exports = router;