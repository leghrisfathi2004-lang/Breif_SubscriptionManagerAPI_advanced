 const joi = require('joi');

const validateUser = (req, res, next) => {
    const userShema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });
    const err = userShema.validate(req.body);
    if (err)  
        return respond(res, 400, err.details[0].message);
    next();
}

const validateTran = (req, res, next) => {
    const tranShema = joi.object({
        paymentDate: joi.string().required(),
        amount: joi.number().positive().required(),
        subId: joi.required()
    });
    const er = tranShema.validate(req.body);
    if (er) 
        return respond(res, 400, er.details[0].message);
    next();
}

const validateSub = (req, res, next) => {
    const subShema = joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        billingCycle: joi.string().valid("monthly", "yearly").required()
    });
    const er = subShema.validate(req.body);
    if (er) 
        return respond(res, 400, er.details[0].message);
    next();
}

module.exports = {validateSub, validateUser, validateTran};