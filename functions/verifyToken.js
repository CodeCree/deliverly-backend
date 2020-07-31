const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

module.exports = async function (req, res, next) {

    // Gets token from header (not body)
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ "success": false, "message": "No token received" })

    try {
        // trys to verify token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        let userId = verified.id;

        let user = await UserModel.findOne({ _id: userId });
        if (!user) return res.status(400).send({ "success": false, "message": "Invalid token" });

        req.user = user;
        console.log(user);
        next();

    } catch (err) {
        // If jwt cant verify token
        res.status(400).send({ "success": false, "message": "Invalid token" });
    }
}