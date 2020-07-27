const ping = require("./ping");

module.exports = function (app, db) {
    ping(app, db);
}