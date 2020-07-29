const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ "success": false, "message": "No token received" })

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;

    } catch (err) {
        res.status(400).send({ "success": false, "message": "Invalid token" });
    }
}