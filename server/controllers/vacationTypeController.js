const VacationType = require('../models/vacation-type');
const Joi = require('joi');

exports.create = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    expirationDate: Joi.date().iso().greater('now').required(),
    memo: Joi.string().allow('')
  });


  const {error, value} = schema.validate(req.body);
  if (error) {
    res.status(400).json({message: error.details[0].message});
    return;
  }

  const {name, expirationDate, memo} = value;

  try {
    const vacationType = await VacationType.create({
      name,
      expirationDate,
      memo
    });
    res.status(201).json({vacationType});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  }
};