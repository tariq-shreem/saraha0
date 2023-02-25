const Joi = require('joi');

const signup = {

    body:Joi.object().required().keys({
        name:Joi.string().min(3).max(15).required().messages({
            'any.required':'plz send your name',
            'string.empty':'name is required'
        }),
        email:Joi.string().email().required(),
        password:Joi.string().min(5).max(20).required(),
        cPassword:Joi.string().valid(Joi.ref('password')).required(),
        age:Joi.number(),
    })

}

const signin= {
    body:Joi.object().required().keys({
        email:Joi.string().email().required().messages({
            'any.required':'email is required',
        }),
        password:Joi.string().required()
    })
}
module.exports={signup,signin}