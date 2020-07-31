module.exports = function (req, res, next) {
    if (!req.user) return res.status(401).send({ "success": false, "error": "Invalid token" });
    if (!req.user.operator) return res.status(403).send({ "success": false, "error": "Insufficient permission" });
    next();
}