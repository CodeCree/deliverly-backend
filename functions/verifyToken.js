const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    // Gets token from header (not body)
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ "success": false, "message": "No token received" })

    try {
        // trys to verify token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();

    } catch (err) {
        // If jwt cant verify token
        res.status(400).send({ "success": false, "message": "Invalid token" });
    }
}