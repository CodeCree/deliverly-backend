const password = require("password");

module.exports = function () {
    return password(3).split(" ").join("-");
}