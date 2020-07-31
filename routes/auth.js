const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyOp = require("../functions/verifyOperator");
const UserModel = require("../models/User");
const { loginValidation, userPasswordValidation, userValidation } = require("../functions/validation");
const verify = require("../functions/verifyToken");


function formatUserJson(user) {
    return {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        operator: user.operator
    }
}

router.post("", verify, verifyOp, async (req, res) => {

    // Post validation
    const { error } = userPasswordValidation(req.body)
    if (error) return res.status(400).send({
        "success": false,
        "error": error.details[0].message
    });

    // Checking if user is already registered
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send({ "success": false, "error": "Email has already been registered" })

    // If all other checks are ok.. hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // New user model
    const User = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        operator: req.body.operator
    });

    // Save + catch error
    try {
        await User.save();
        var users = await UserModel.find().sort({ email: 1 });
        res.send({ "success": true, "id": User._id, "data": users.map(user => formatUserJson(user)) });
    } catch (error) {
        res.status(400).send(error);
    }

});

//Update a user
router.put("/:id", verify, verifyOp, async (req, res) => {
    //Check user exists
    var user = await UserModel.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({
        "success": false,
        "error": 'User does not exist'
    });

    //Validation
    if (req.body.password) {
        const { error } = userPasswordValidation(req.body);
        if (error) return res.status(400).send({
            "success": false,
            "error": error.details[0].message
        });
    }
    else {
        const { error } = userValidation(req.body);
        if (error) return res.status(400).send({
            "success": false,
            "error": error.details[0].message
        });
    }
    
    //Check email
    const emailExists = await UserModel.findOne({ email: req.body.email, _id: { $ne: user._id }});
    if (emailExists) return res.status(400).send({ "success": false, "error": "Email has already been registered" });

    //Check op if same user
    if (req.user._id === user._id && !req.body.operator) return res.status(400).send({ "success": false, "error": "You cannot demote yourself" });

    //Password validation
    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        user.password = hashedPassword;
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.operator = req.body.operator;

    // Save + catch error
    try {
        await user.save();
        var users = await UserModel.find().sort({ email: 1 });
        res.send({ "success": true, "data": users.map(user => formatUserJson(user)) });
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
    if (!user) return res.status(400).send({ "success": false, "error": "Email or password is incorrect" })

    // Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ "success": false, "error": "Email or password is incorrect" });

    // Create and assign new jsonwebtoken
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);

    let jsonUser = formatUserJson(user);
    jsonUser.token = token;
    // Returns token on successful login
    res.send({
        "success": true,
        "data": jsonUser
    });
});

router.get("/me", verify, async (req, res) => {
    res.send({
        "success": true,
        "data": formatUserJson(req.user)
    });
});

router.get("", verify, verifyOp, async (req, res) => {
    var users = await UserModel.find().sort({ email: 1 });

    res.send({
        "success": true,
        "data": users.map(user => formatUserJson(user))
    });
});

module.exports = router;