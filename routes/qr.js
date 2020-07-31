const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');

router.get("/qr-code", async (req, res) => {

    var qrs = [];
    for (i = 0; i < 15; i++) {
        qrs.push("deliverly" + uuidv4().split("-").join(""));
    }
    res.send({
        "success": true,
        "data": qrs
    });
});

module.exports = router;