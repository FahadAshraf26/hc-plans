import Joi from '@hapi/joi';
import validator from '../validator';

// TODO: put this logic in Domain entity

const now = Date.now();
const minAge = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18); // go back by 18 years

const userBodySchema = Joi.object({
  firstName: Joi.string().min(2),
  lastName: Joi.string().min(2),
  userName: Joi.string().min(6),
  email: Joi.string().email({
    tlds: false,
  }),
  address: Joi.string().min(3),
  city: Joi.string().min(3),
  state: Joi.string().min(2).max(2),
  zipCode: Joi.number().integer(),
  dob: Joi.date()
    .iso()
    .max(minAge)
    .messages({ 'date.max': 'must be atleast 18 years old' }),
  phoneNumber: Joi.string().min(10).messages({ 'string.min': 'invalid phone number' }),
  linkedIn: Joi.string().min(3),
  twitter: Joi.string().min(3),
  instagram: Joi.string().min(3),
  website: Joi.string().min(3),
  facebook: Joi.string().min(3),
  ssn: Joi.alternatives().try(
    Joi.string()
      .min(4)
      .max(9)
      .messages({ 'string.min': 'invalid ssn', 'string.max': 'invalid ssn' }),
    Joi.string()
      .pattern(new RegExp(/^[0-9]{3}-[0-9]{2}-[0-9]{4}/))
      .messages({ 'string.max': 'invalid ssn' }),
  ),
  prefix: Joi.string().min(1),
}).unknown(true);

export default validator(userBodySchema);
