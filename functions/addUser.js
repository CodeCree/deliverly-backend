const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

module.exports = async function (req, res, next) {

    // Gets token from header (not body)
    const token = req.header("Authorization");
    if (!token) return next();

    try {
        // trys to verify token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        let userId = verified.id;

        let user = await UserModel.findOne({ _id: userId });
        if (!user) return next();

        req.user = user;
        next();

    } catch (err) {
        // If jwt cant verify token
        next();
    }
}