const router = require("express").Router();
const verify = require("../functions/verifyTokenOp");

router.post("/package", verify, async (req, res) => {
    res.send({ "success": true, "message": `Op status: ${req.user.operator}` })
});

module.exports = router;