const Joi = require('joi')

// todo -> schema validation
const txSchema = Joi.object({
  to: Joi.string()
    .hex()
    .required(),
  from: Joi.string()
    .hex(),
  data: Joi.string()
    .hex(),
  value: Joi.string()
})

module.exports = txSchema;
