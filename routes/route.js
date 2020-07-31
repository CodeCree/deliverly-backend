const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const routeModel = require("../models/Route");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const { routeInValidation } = require("../functions/validation");
const verifyOp = require("../functions/verifyTokenOp");

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

router.get("/routes/all", verifyOp, async (req, res) => {

    var routes = await routeModel.find({});
    res.send({
        "success": true,
        "data": routes
    })


})

router.get("/routes", verify, async (req, res) => {

    var user = jwt.decode(req.header("Authorization"));

    var routes = await routeModel.find({userId: user._id});
    res.send({
        "success": true,
        "data": routes
    })


});

module.exports = router;