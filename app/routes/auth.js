const router = require("express").Router();
const User = require("../model/User");
const Address = require("../model/Address");

router.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        address: new Address({
            street: req.body.address.street,
            town: req.body.address.town,
            city: req.body.address.city,
            postcode: req.body.address.postcode
        }),
        password: req.body.password
    });

    try {
        const savedUser = await user.save(function (err) {
            console.log("saved!");
            if (err) throw err;
        });
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;