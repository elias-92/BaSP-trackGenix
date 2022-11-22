import Joi from 'joi';

export const schema = Joi.object({
  description: Joi.string().min(5).max(50).alphanum().required().messages({
    'string.min': 'Description must contain at least 5 letters.',
    'string.max': 'Description cannot have over 50 letters.',
    'string.empty': 'Description is required'
  })
});
