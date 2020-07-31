const router = require("express").Router();
const jwt = require("jsonwebtoken");
const packageModel = require("../models/Package");
const addressModel = require("../models/Address");
const warehouseModel = require("../models/Warehouse");
const verify = require("../functions/verifyToken");
const addUser = require("../functions/addUser");
const customerCodeGen = require("../functions/customerCodeGenerator");
const geolocate = require("../functions/geolocate");
const { packageInValidation } = require("../functions/validation");
const userModel = require("../models/User");
const eventModel = require("../models/Event");
const routeModel = require("../models/Route");

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

    if (req.body.qrCode) {
        if (req.body.qrCode.length != 34) return res.status(400).send({ success: false, error: 'Invalid QR code' });
        if (!req.body.qrCode.startsWith('de')) return res.status(400).send({ success: false, error: 'Invalid QR code' });

        let existingPackage = await packageModel.findOne({ qrCode: req.body.qrCode });
        if (existingPackage) return res.status(400).send({ success: false, error: 'QR code is already assigned to a package' });
    }

    let events = [];
    let route = null;
    if (req.body.warehouse) {
        let warehouse = await warehouseModel.findOne({ uuid: req.body.warehouse });
        if (!warehouse) return res.status(400).send({ success: false, error: 'Invalid warehouse'});
        events = [
            new eventModel({
                at: Date.now(),
                type: 'warehouse',
                warehouse: req.body.warehouse
            })
        ];
    }
    else if (req.body.route) {
        route = await routeModel.findOne({ _id: req.body.route });
        if (!route) return res.status(400).send({ success: false, error: 'Invalid route'});
        if (route.endedAt) return res.status(400).send({ success: false, error: 'Route ended'});
        if (route.packages.includes(package._id)) return res.status(400).send({ success: false, error: 'Already in route'});

        events = [
            new eventModel({
                at: Date.now(),
                type: 'route',
                route: req.body.route
            })
        ];
    }

    let collection = undefined;
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
        
        collection = new addressModel({
            coordinates: collectCoordinates,
            street: req.body.collect.street,
            city: req.body.collect.city,
            postcode: req.body.collect.postcode
        });
    }

    // Makes a new package
    let package = new packageModel({
        code: customerCode,
        qrCode: req.body.qrCode,
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
        collect: collection,
        premium: req.body.premium,
        events: events
    });

    // Save + catch error
    try {
        await package.save();
        if (route) {
            route.packages.push(package._id);
            await route.save();
        }
        res.send({ "success": true, data: package });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/package/search", async (req, res) => {
    let query = req.query.query;
    if (!query) query = '';
    query = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let packages = await packageModel.find({
        $or: [
            {recipient: { $regex: new RegExp(query, 'i') }},
            {email: { $regex: new RegExp(query, 'i') }}
    ]
    }).sort({
        qrCode: 1,
        _id: -1,
    }).limit(20);

    res.send({
        "success": true,
        "data": packages.map(package => {
            return {
                title: package.code,
                description: `${package.recipient} - ${package.address.street}, ${package.address.city}, ${package.address.postcode}`,
                price: !package.qrCode && 'No QR code'
            }
        })
    });

})

router.patch("/package/:code", verify, async (req, res) => {
    var package = await packageModel.findOne({qrCode: req.params.code});
    if (package == null) return res.status(404).send({"success": false, "error": "Package not found"})

    let route = null;
    if (req.body.route) {
        route = await routeModel.findOne({ _id: req.body.route });
        if (!route) return res.status(400).send({ success: false, error: 'Invalid route'});
        if (route.endedAt) return res.status(400).send({ success: false, error: 'Route ended'});
        if (route.packages.includes(package._id)) return res.status(400).send({ success: false, error: 'Already in route'});

        package.events.push(new eventModel({
            at: Date.now(),
            type: 'route',
            route: req.body.route
        }));
    }
    else if (req.body.warehouse) {
        let warehouse = await warehouseModel.findOne({ uuid: req.body.warehouse });
        if (!warehouse) return res.status(400).send({ success: false, error: 'Invalid warehouse'});

        package.events.push(new eventModel({
            at: Date.now(),
            type: 'warehouse',
            route: req.body.warehouse
        }));
    }
    else if (req.body.delivered) {
        package.events.push(new eventModel({
            at: Date.now(),
            type: 'delivered'
        }));
    }
    else return res.status(404).send({"success": false, "error": "Invalid method"})

    await package.save();
    if (route) {
        route.packages.push(package._id);
        await route.save();
    }

    return res.send({
        "success": true,
        "data": package
    });
});

router.get("/package/:code", addUser, async (req, res) => {
    // If ther user is authorized, require qr hashes
    if(req.user)
    {
        // Find a package from the request
        var package = await packageModel.findOne({qrCode: req.params.code});
        if (package == null) return res.status(404).send({"success": false, "error": "Package not found"})
        // Returns the package
        return res.send({
            "success": true,
            "data": package
        })
        
    } 
    else {
        // If the user isn't authorized (eg, a customer), require code
        var package = await packageModel.findOne({ code: req.params.code });
        // Checking if package exists
        if (package == null) return res.status(400).send({ "success": false, "error": "Package does not exist" })
    }

    let events = [];

    for (event of package.events) {
        switch (event.type) {
            case 'warehouse':
                var warehouse = await warehouseModel.findOne({ uuid: event.warehouse });
                events.push({
                    at: event.at,
                    type: 'warehouse',
                    location: warehouse && warehouse.address.coordinates,
                    title: `Arrived at ${!warehouse ? 'warehouse' : warehouse.name}`
                });
                break;
            case 'route':
                events.push({
                    at: event.at,
                    type: 'route',
                    title: `In transit`
                });
                break;
            default:
                events.push({
                    at: event.at,
                    type: event.type,
                    title: 'In transit'
                });
                break;
        }
    };

    res.send({
        "success": true,
        "data": {
            code: package.code,
            weight: package.weight,
            recipient: package.recipient,
            email: package.email,
            address: package.address,
            events: events
        }
    });

});

module.exports = router;