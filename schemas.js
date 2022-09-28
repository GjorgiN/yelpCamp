const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        imageUrl: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
    }).required()
});