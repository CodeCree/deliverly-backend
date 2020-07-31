const router = require("express").Router();
const addressModel = require("../models/Address");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const verifyOp = require("../functions/verifyTokenOp");
const geolocate = require("../functions/geolocate");
const { warehouseInValidation } = require("../functions/validation");
const { v4: uuidv4 } = require('uuid');

router.post("/warehouse", verifyOp, async (req, res) => {

    const { error } = warehouseInValidation(req.body);
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    // Makes the address based on input parameters
    var addressString = req.body.address.street + " " + req.body.address.city + " " + req.body.address.postcode;
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

    const Warehouse = new warehouseModel({
        uuid: uuidv4(),
        name: req.body.name,
        address: new addressModel({
            coordinates: [lat, long],
            street: req.body.address.street,
            city: req.body.address.city,
            postcode: req.body.address.postcode
        })
    });

    try {
        await Warehouse.save();
        res.send({ "success": true, "id": Warehouse.uuid, "data":  await warehouseModel.find({})});
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get("/warehouses", verify, async (req, res) => {

    var warehouses = await warehouseModel.find({});
    res.send({
        "success": true,
        "data": warehouses
    })

});

router.get("/warehouse/:uuid", verify, async (req, res) => {

    var warehouse = await warehouseModel.findOne({ uuid: req.params.uuid });
    // Checking if package exists
    if (warehouse == null) return res.status(400).send({ "success": false, "message": "Warehouse does not exist" })

    res.send({
        "success": true,
        "data": {
            "uuid": warehouse.uuid,
            "name": warehouse.name,
            "address": warehouse.address
        }
    });


});

module.exports = router;