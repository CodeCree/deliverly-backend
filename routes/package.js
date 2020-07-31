const router = require("express").Router();
const jwt = require("jsonwebtoken");
const packageModel = require("../models/Package");
const addressModel = require("../models/Address");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const customerCodeGen = require("../functions/customerCodeGenerator");
const geolocate = require("../functions/geolocate");
const { packageInValidation } = require("../functions/validation");
const userModel = require("../models/User");

router.post("/package", verify, async (req, res) => {

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
    var addressString = req.body.address.street + " " + req.body.address.city + " " + req.body.address.postcode;
    // Using googles geolocate api
    const coordinates = await geolocate(addressString);

    // Makesure there is no errors
    if (!coordinates) {
        return res.status(400).send({
            "success": false,
            "error": result.error_message
        })
    }

    // If its a collection
    if (req.body.collect) {
        var collectString = req.body.collect.street + " " + req.body.collect.city + " " + req.body.collect.postcode;
        var collectCoordinates = await geolocate(collectString);

        if (!collectCoordinates) {
            return res.status(400).send({
                "success": false,
                "error": result.error_message
            })
        }

        // Makes a new package
        var Package = new packageModel({
            code: customerCode,
            warehouse: req.body.warehouse,
            weight: req.body.weight,
            recipient: req.body.recipient,
            email: req.body.email,
            address: new addressModel({
                coordinates: coordinates,
                street: req.body.address.street,
                city: req.body.address.city,
                postcode: req.body.address.postcode
            }),
            collect: new addressModel({
                coordinates: collectCoordinates,
                street: req.body.collect.street,
                city: req.body.collect.city,
                postcode: req.body.collect.postcode
            }),
            premium: req.body.premium
        });

    } else {
        // Makes a new package
        var Package = new packageModel({
            code: customerCode,
            warehouse: req.body.warehouse,
            weight: req.body.weight,
            recipient: req.body.recipient,
            email: req.body.email,
            address: new addressModel({
                coordinates: [lat, long],
                street: req.body.address.street,
                city: req.body.address.city,
                postcode: req.body.address.postcode
            }),
            premium: req.body.premium
        });
    }

    // Save + catch error
    try {
        await Package.save();
        res.send({ "success": true, "customerCode": customerCode, "id": Package._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/package/:code", async (req, res) => {

    // If ther user is authorized, require qr hashes
    if(req.header("Authorization")){
        try {
            // trys to verify token
            var verified = jwt.verify(req.header("Authorization"), process.env.TOKEN_SECRET);
            // finds the user from the token
            var user = await userModel.find({_id : verified._id})
            // If the user exists, continue
            if(user){
                // Find a package from the request
                var package = await packageModel.findOne({qrHash: req.params.code});
                if(package == null) return res.status(404).send({"success": false, "error": "Package not found"})
                // Returns the package
                res.send({
                    "success": true,
                    "data": package
                })
            }
    
        } catch (err) {
            // If jwt cant verify token
            res.status(400).send({ "success": false, "error": "Invalid token" });
        }


        // If the user isn't authorized (eg, a customer), require code
    } else { 
        var package = await packageModel.findOne({ code: req.params.code });
        // Checking if package exists
        if (package == null) return res.status(400).send({ "success": false, "error": "Package does not exist" })
    }

    

    package.events.forEach(async event => {

        if (event.route) return;
        var warehouse = await warehouseModel.findOne({ uuid: event.warehouse });
        if (!warehouse) return;

        event.location.lat = warehouse.address.coordinates[0];
        event.location.long = warehouse.address.cordinates[1];
    });

    res.send({
        "success": true,
        "data": {
            code: package.code,
            weight: package.weight,
            recipient: package.recipient,
            email: package.email,
            address: package.address,
            events: package.events
        }
    });

})

module.exports = router;