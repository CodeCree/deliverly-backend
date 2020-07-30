const router = require("express").Router();
const packageModel = require("../models/Package");
const addressModel = require("../models/Address");
const verify = require("../functions/verifyToken");
const customerCodeGen = require("../functions/customerCodeGenerator");
const geolocate = require("../functions/geolocate")
const { packageInValidation } = require("../functions/validation");

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

    // Makes the address based on input parameters
    var addressString = req.body.address.street + " " + req.body.address.town + " " + req.body.address.city + " " + req.body.address.postcode;
    // Using googles geolocate api
    const result = await geolocate(addressString);

    // Makesure there is no errors
    if (result.status != "OK") {
        return res.status(401).send({
            "success": false,
            "message": result.error_message
        })
    }

    var lat = result.results[0].geometry.location.lat.toFixed(4);
    var long = result.results[0].geometry.location.lng.toFixed(4);

    // If its a collection
    if (req.body.collect) {
        var collectString = req.body.collect.street + " " + req.body.collect.town + " " + req.body.collect.city + " " + req.body.collect.postcode;
        var collectResult = await geolocate(addressString);

        if (collectResult.status != "OK") {
            return res.status(401).send({
                "success": false,
                "message": result.error_message
            })
        }

        var coLat = collectResult.results[0].geometry.location.lat.toFixed(4);
        var coLong = collectResult.results[0].geometry.location.lng.toFixed(4);
    }


    const Package = new packageModel({
        code: customerCode,
        warehouse: req.body.warehouse,
        weight: req.body.weight,
        recipient: req.body.recipient,
        email: req.body.email,
        address: new addressModel({
            coordinates: [lat, long],
            street: req.body.address.street,
            town: req.body.address.town,
            city: req.body.address.city,
            postcode: req.body.address.postcode
        }),
        collect: new addressModel({
            coordinates: [coLat, coLong],
            street: req.body.collect.street,
            town: req.body.collect.town,
            city: req.body.collect.city,
            postcode: req.body.collect.postcode
        }),
        premium: req.body.premium
    });

    // Saves package to database
    // Save + catch error
    try {
        await Package.save();
        res.send({ "success": true, "customerCode": customerCode });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;