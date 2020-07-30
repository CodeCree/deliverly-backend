const router = require("express").Router();
const packageModel = require("../models/Package");
const addressModel = require("../models/Address");
const verify = require("../functions/verifyToken");
const customerCodeGen = require("../functions/customerCodeGenerator");
const { packageInValidation } = require("../functions/validation");
const axios = require("axios");

router.post("/package", verify, async (req, res) => {

    console.log(req.body);

    // Making sure there is nothing wring withthe request
    const { error } = packageInValidation(req.body);
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    while (true) {
        var customerCode = customerCodeGen();
        if (await packageModel.findOne({ customerCode: customerCode }) == null) break;
    }

    var addressString = req.body.address.street + " " + req.body.address.city + " " + req.body.address.postcode;

    const package = new packageModel({
        customerCode: customerCode,
        warehouse: req.body.warehouse,
        weight: req.body.weight,
        recipient: req.body.recipient,
        address: new addressModel({
            coordinates: 
        })
    });



    res.send({ "success": true, "message": `Op status: ${req.user.operator}` })
});

module.exports = router;