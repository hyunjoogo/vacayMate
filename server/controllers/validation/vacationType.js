const Joi = require('joi');

const vacationTypeSchema = Joi.object({
  name: Joi.string().required(),
  expirationDate: Joi.date().iso().greater('now').required(),
  vacationTimeTypes: Joi.object().required(),
  memo: Joi.string().allow('')
});

module.exports = vacationTypeSchema;
