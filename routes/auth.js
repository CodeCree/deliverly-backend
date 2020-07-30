const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { registerValidation } = require("../functions/validation");
const { loginValidation } = require("../functions/validation");

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

router.post("/login", async (req, res) => {

    // Post validation
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    // Checking if user is already registered
    const user = await UserModel.findOne({ email: req.body.email });
    //  Change this to a vague message pre staging
    if (!user) return res.status(400).send({ "success": false, "message": "Email or password is incorrect" })

    // Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ "success": false, "message": "Email or password is incorrect" });

    // Create and assign new jsonwebtoken
    const token = jwt.sign({ _id: user._id, operator: user.operator }, process.env.TOKEN_SECRET);

    // Returns token on successful login
    res.send({ "success": true, "email": user.email, "operator": user.operator, "token": token });

})


module.exports = router;