// Validation
const Joi = require("@hapi/joi");

// Register validation
const registerValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
        terms: Joi.boolean().required()
    });

    return schema.validate(data);
}

// Login validation
const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(data);
}

const packageInValidation = (data) => {

    const schema = Joi.object({
        warehouse: Joi.string().required(),
        weight: Joi.number().required(),
        recipient: Joi.string().required(),
        address: Joi.object({
            street: Joi.string().required(),
            town: Joi.string(),
            city: Joi.string().required(),
            postcode: Joi.string().required()
        })
    });

    return schema.validate(data);

}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.packageInValidation = packageInValidation;