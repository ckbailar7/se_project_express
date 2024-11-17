const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validation schema for updating user profiles
const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional().messages({
    "string.min": 'The minimum length of the "name" field is 2',
    "string.max": 'The maximum length of the "name" field is 30',
    "string.empty": 'The "name" field must be filled in with a value',
  }),
  avatar: Joi.string().required().custom(validateUrl).messages({
    "string.empty": 'The "imageUrl" field must be filled in',
    "string.uri": 'the "imageUrl" field must be a valid url',
  }),
});

// Validation schema for getting user by Id
const getUserByIdSchema = Joi.object({
  userId: Joi.string().length(24).hex().required().messages({
    "string.length": "The userId must be a valid 24-character MongoDB ObjectId",
    "string.hex": "The userId must be a valid hexadecimal string",
  }),
});

// Validate the clothingItem body
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in with a value',
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "userName" field is 2',
      "string.max": 'The maximum length of the "userName" field is 30',
      "string.empty": 'The "userName" field must be filled in with a value',
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validating Route for signing in a user
const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validate route for fetching user ids when they are accessed

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  updateUserProfileSchema,
  getUserByIdSchema,
  validateClothingItem,
  validateUserSignup,
  validateUserSignin,
  validateUrl,
  validateId,
};
