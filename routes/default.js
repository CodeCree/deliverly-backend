const router = require("express").Router();

router.get("/ping", async (req, res) => {
    res.send({ "success": true, "message": "Online" });
});

module.exports = router;