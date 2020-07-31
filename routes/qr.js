const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const verify = require("../functions/verifyToken");
const packageModel = require("../models/Package");

router.get("/qr-code", verify, async (req, res) => {

    var qrs = [];
    for (i = 0; i < 15; i++) {
        qrs.push("de" + uuidv4().split("-").join(""));
    }
    res.send({
        "success": true,
        "data": qrs
    });
});

router.post("/qr-code/:code", verify, async (req, res) => {
    if (!req.params.code) return res.status(400).send({ success: false, error: 'Invalid QR code' });
    if (req.params.code.length != 34) return res.status(400).send({ success: false, error: 'Invalid QR code' });
    if (!req.params.code.startsWith('de')) return res.status(400).send({ success: false, error: 'Invalid QR code' });

    let existingPackage = await packageModel.findOne({ qrCode: req.params.code });
    if (existingPackage) return res.status(400).send({ success: false, error: 'QR code is already assigned to a package' });

    if (!req.body.package) return res.status(400).send({ success: false, error: 'Invalid package' });
    let package = await packageModel.findOne({ code: req.body.package });
    if (!package) return res.status(400).send({ success: false, error: 'Invalid package' });

    package.qrCode = req.params.code;
    try {
        await package.save();
        return res.send({ success: true, data: package });
    }
    catch (error) {
        return res.status(400).send({ success: false, error: 'An error occured' });
    }

});


module.exports = router;