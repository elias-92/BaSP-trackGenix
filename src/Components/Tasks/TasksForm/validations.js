import Joi from 'joi';

export const schema = Joi.object({
  description: Joi.string()
    .min(5)
    .max(50)
    .pattern(/^(?=.[a-zA-Z].)([\w\s\W]+)$/)
    .required()
    .messages({
      'string.min': 'Description must contain at least 5 letters.',
      'string.max': 'Description cannot have over 50 letters.',
      'string.empty': 'Description is required',
      'string.pattern.base': `Description can't have only numbers or special characters`
    })
});
