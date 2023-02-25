const Joi = require('joi');

const sendMessage = {

    params:Joi.object().required().keys({
        reciverId:Joi.string().min(24).max(24).required()
    }),
    body:Joi.object().required().keys({
        message:Joi.string().required().min(5).max(400)
    })
}

module.exports={sendMessage}