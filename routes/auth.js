const router = require("express").Router();
const UserModel = require("../models/User");
const AddressModel = require("../models/Address");

// Validation
const Joi = require("@hapi/joi");

const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required(),
    address: Joi.object().required(),
    terms: Joi.boolean().required()
});

router.post("/register", async (req, res) => {

    // Post validation
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0]);

    const User = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        var saveUser = await User.save();
        res.send(saveUser);
    } catch (error) {
        res.status(400).send(error);
    }


});

module.exports = router;