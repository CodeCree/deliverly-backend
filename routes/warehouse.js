const router = require("express").Router();
const addressModel = require("../models/Address");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const verifyOp = require("../functions/verifyTokenOp");
const geolocate = require("../functions/geolocate");
const { warehouseInValidation } = require("../functions/validation");
const { v4: uuidv4 } = require('uuid');


function formatWarehouseJson(warehouse) {
    return {
        id: warehouse.uuid,
        name: warehouse.name,
        address: {
            street: warehouse.address.street,
            town: warehouse.address.city,
            postcode: warehouse.address.postcode,
            location: warehouse.address.coordinates
        }
    }
}

router.post("/warehouse", verifyOp, async (req, res) => {
    const { error } = warehouseInValidation(req.body);
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    // Makes the address based on input parameters
    var addressString = req.body.address.street + " " + req.body.address.city + " " + req.body.address.postcode;
    // Using googles geolocate api
    const coordinates = await geolocate(addressString);

    // Make sure there is no errors
    if (!coordinates) {
        return res.status(400).send({
            "success": false,
            "message": "Invalid address"
        })
    }

    const Warehouse = new warehouseModel({
        uuid: uuidv4(),
        name: req.body.name,
        address: new addressModel({
            coordinates: coordinates,
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

    var warehouses = await warehouseModel.find().sort({name: 1});
    res.send({
        "success": true,
        "data": warehouses.map(warehouse => formatWarehouseJson(warehouse))
    })

});

router.put("/warehouse/:uuid", verifyOp, async (req, res) => {
    var warehouse = await warehouseModel.findOne({ uuid: req.params.uuid });
    if (!warehouse) return res.status(400).send({ "success": false, "error": "Warehouse does not exist" })

    const { error } = warehouseInValidation(req.body);
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    // Makes the address based on input parameters
    var addressString = req.body.address.street + " " + req.body.address.city + " " + req.body.address.postcode;
    // Using googles geolocate api
    const coordinates = await geolocate(addressString);

    // Make sure there is no errors
    if (!coordinates) {
        return res.status(400).send({
            "success": false,
            "message": "Invalid address"
        })
    }

    warehouse.name = req.body.name;
    warehouse.address.street = req.body.address.street;
    warehouse.address.city = req.body.address.city;
    warehouse.address.postcode = req.body.address.postcode;
    warehouse.address.coordinates = coordinates;

    try {
        await warehouse.save();
        let warehouses = await warehouseModel.find().sort({name: 1});
        res.send({
            "success": true,
            "data": warehouses.map(warehouse => formatWarehouseJson(warehouse))
        });
    }
    catch (error) {
        res.send({
            "success": false,
            "error": "An error occured"
        })
    }

});

router.get("/warehouse/:uuid", verify, async (req, res) => {

    var warehouse = await warehouseModel.findOne({ uuid: req.params.uuid });
    if (!warehouse) return res.status(400).send({ "success": false, "error": "Warehouse does not exist" })

    res.send({
        "success": true,
        "data": formatWarehouseJson(warehouse)
    });


});

module.exports = router;