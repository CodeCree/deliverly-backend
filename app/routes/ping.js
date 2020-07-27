module.exports = function (app, db) {

    app.get("/api/ping", (req, res) => {
        console.log(`Received ping request from ${req.ip}`);
        res.send({ success: true, status: "Online" });
    })

}