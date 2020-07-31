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
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
    });

    return schema.validate(data);
}

const packageInValidation = (data) => {

    const schema = Joi.object({
        warehouse: Joi.string(),
        route: Joi.string(),
        weight: Joi.number(),
        recipient: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            postcode: Joi.string().required()
        }),
        collect: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            postcode: Joi.string().required()
        }),
        premium: Joi.date()
    });

    return schema.validate(data);

}

const warehouseInValidation = (data) => {

    const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            postcode: Joi.string().required()
        })
    });

    return schema.validate(data);
}

const routeInValidation = (data) => {

    const schema = Joi.object({
        endWarehouse: Joi.string().required(),
    });

    return schema.validate(data);

}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.packageInValidation = packageInValidation;
module.exports.warehouseInValidation = warehouseInValidation;
module.exports.routeInValidation = routeInValidation;