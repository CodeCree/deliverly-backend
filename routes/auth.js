const router = require("express").Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const { registerValidation } = require("../functions/validation");

router.post("/register", async (req, res) => {

    // Post validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    // Checking if user is already registered
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send({ "success": false, "message": "Email has already been registered" })

    // If all other checks are ok.. hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // New user model
    const User = new UserModel({
        email: req.body.email,
        password: hashedPassword,
    });

    // Save + catch error
    try {
        await User.save();
        res.send({ "success": true });
    } catch (error) {
        res.status(400).send(error);
    }

});

module.exports = router;