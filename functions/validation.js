// Validation
const Joi = require("@hapi/joi");

// User validation
const userValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().min(6).required().email(),
        operator: Joi.boolean(),
    });

    return schema.validate(data);
}
const userPasswordValidation = (data) => {

    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
        operator: Joi.boolean(),
    });

    return schema.validate(data);
}

// Login validation
const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
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
        premium: Joi.date(),
        qrCode: Joi.string()
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

const breadcrumbValidation = (data) => {

    const schema = Joi.object({
        latitude: Joi.number().required().min(-90).max(90),
        longitude: Joi.number().required().min(-180).max(80),
    });

    return schema.validate(data);

}


module.exports.loginValidation = loginValidation;
module.exports.userValidation = userValidation;
module.exports.userPasswordValidation = userPasswordValidation;
module.exports.packageInValidation = packageInValidation;
module.exports.warehouseInValidation = warehouseInValidation;
module.exports.routeInValidation = routeInValidation;
module.exports.breadcrumbValidation = breadcrumbValidation;