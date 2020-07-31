const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const routeModel = require("../models/Route");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const { routeInValidation } = require("../functions/validation");

// Makes a new route
router.post("/route", verify, async (req, res) => {

    // Making sure there is nothing wring withthe request
    const { error } = routeInValidation(req.body);
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    if (await warehouseModel.findOne({ uuid: req.body.endWarehouse }) == null) {
        return res.status(400).send({
            "success": false,
            "error": "Warehouse does not exist"
        });
    }

    var userId = jwt.decode(req.header("Authorization"))._id;
    var Route = new routeModel({
        userId: userId,
        endWarehouse: req.body.endWarehouse
    });

    try {
        await Route.save();
        res.send({ "success": true });
    } catch (error) {
        res.status(400).send(error);
    }

});

module.exports = router;