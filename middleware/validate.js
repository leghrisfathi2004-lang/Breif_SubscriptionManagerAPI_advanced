const joi = require('joi');
const respond = require('../middleware/respond.js')

const validateUser = (req, res, next) => {
    const userShema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        role: joi.string().valid("user", "admin")
    });
    const { errour } = userShema.validate(req.body);
    if (errour) 
        return respond(res, 400, errour.details[0].message);
    next();
}

const validateSub = (req, res, next) => {
    const subShema = joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        billingCycle: joi.string().valid("monthly", "yearly").required(),
        startDate: joi.date(),
        status: joi.boolean().valid(true, false)
    });

    const { errour} = subShema.validate(req.body);

    if (errour) 
        return respond(res, 400, errour.details[0].message);

    next();
}

const validateTran = (req, res, next) => {
    const tranShema = joi.object({
        name: joi.string().required(),
        amount: joi.number().required(),
        paymentDate: joi.date(),
    });

    const { errour } = subShema.validate(req.body);

    if (errour) 
        return respond(res, 400, errour.details[0].message);

    next();
}

module.exports = {validateSub, validateUser, validateTran};