const router = require("express").Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const routeModel = require("../models/Route");
const warehouseModel = require("../models/Warehouse");
const packageModel = require("../models/Package");
const eventModel = require("../models/Event");
const verify = require("../functions/verifyToken");
const { routeInValidation } = require("../functions/validation");
const verifyOp = require("../functions/verifyOperator");
const { route } = require("./auth");

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
    var route = new routeModel({
        userId: req.user.id,
        endWarehouse: req.body.endWarehouse
    });

    try {
        await route.save();
        res.send({ "success": true, data: route._id });
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get("/routes/all", verify, verifyOp, async (req, res) => {

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

router.post("/route/:route/start", verify, async (req, res) => {
    if (!req.params.route) return res.status(400).send({success: false, error: 'Invalid route'});
    var route = await routeModel.findOne({_id: req.params.route});
    if (!route) return res.status(400).send({success: false, error: 'Invalid route'});

    if (req.user.id != route.userId) return res.status(400).send({success: false, error: 'Invalid route3'});
    if (route.startedAt) return res.status(400).send({success: false, error: 'Already started'});
    route.startedAt = Date.now();

    await route.save();
    res.send({
        "success": true,
        "data": route
    })
});
router.post("/route/:route/end", verify, async (req, res) => {
    if (!req.params.route) return res.status(400).send({success: false, error: 'Invalid route'});
    var route = await routeModel.findOne({_id: req.params.route});
    if (!route) return res.status(400).send({success: false, error: 'Invalid route'});

    if (req.user.id != route.userId) return res.status(400).send({success: false, error: 'Invalid route'});
    if (route.endedAt) return res.status(400).send({success: false, error: 'Already ended'});
    route.endedAt = Date.now();

    await route.save();

    //Add all packages to end warehouse
    for (let packageId of route.packages) {
        let package = await packageModel.findOne({_id: packageId});
        if (!package) continue;

        if (package.events[package.events.length-1].route == route._id || package.events.length === 0) {
            package.events.push(new eventModel({
                type: 'warehouse',
                warehouse: route.endWarehouse,
                at: Date.now()
            }));
            await package.save();
        }
    }

    res.send({
        "success": true,
        "data": route
    })
});
router.get("/route/:route", verify, async (req, res) => {
    if (!req.params.route) return res.status(400).send({success: false, error: 'Invalid route1'});
    var route = await routeModel.findOne({_id: req.params.route});
    if (!route) return res.status(400).send({success: false, error: 'Invalid route2'});

    if (req.user.id != route.userId && !req.user.operator) return res.status(400).send({success: false, error: 'Invalid route3'});

    res.send({
        "success": true,
        "data": route
    })
});

module.exports = router;