// Import validator and celebrate there, together with Joi:
const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
// const router = require("../routes");

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
  userAvatar: Joi.string().required().custom(validateUrl).messages({
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
  }),
});

// Validating Route for creating a clothing item
// router.post(
//   "/",
//   celebrate({
//     body: Joi.object().keys({
//       name: Joi.string().required().min(2).max(30).messages({
//         "string.min": 'The minimum length of the "name" field is 2',
//         "string.max": 'The maximum length of the "name" field is 30',
//         "string.empty": 'The "name" field must be filled in with a value',
//       }),
//       imageUrl: Joi.string().required().custom(validateUrl).messages({
//         "string.empty": 'The "imageUrl" field must be filled in',
//         "string.uri": 'the "imageUrl" field must be a valid url',
//       }),
//     }),
//   }),
// );

// Validating user info body when user is created

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    userName: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "userName" field is 2',
      "string.max": 'The maximum length of the "userName" field is 30',
      "string.empty": 'The "userName" field must be filled in with a value',
    }),
    userAvatar: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validating user info body when user is created
// router.post(
//   "/signup",
//   celebrate({
//     body: Joi.object().keys({
//       userName: Joi.string().required().min(2).max(30).messages({
//         "string.min": 'The minimum length of the "userName" field is 2',
//         "string.max": 'The maximum length of the "userName" field is 30',
//         "string.empty": 'The "userName" field must be filled in with a value',
//       }),
//       userAvatar: Joi.string().required().custom(validateUrl).messages({
//         "string.empty": 'The "imageUrl" field must be filled in',
//         "string.uri": 'the "imageUrl" field must be a valid url',
//       }),
//       email: Joi.string().required().email(),
//       password: Joi.string().required(),
//     }),
//   }),
// );

// Validating Route for signing in a user
const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// router.post(
//   "/signin",
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required(),
//     }),
//   }),
// );

// Validate route for fetching user ids when they are accessed

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});
// router.use(
//   "/users",
//   celebrate({
//     body: Joi.object().keys({
//       id: Joi.string().length(24).hex().required(),
//     }),
//   }),
// );

// module.exports.validateId = celebrate({
//   params: Joi.object().keys({
//     itemId: Joi.string().length(24).hex().required(),
//   }),
// });

//

// Validating route for fetching clothing item ids when they are accessed

const validateClothingItemRouteId = celebrate({
  body: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

// router.use(
//   "items",
//   celebrate({
//     body: Joi.object().keys({
//       id: Joi.string().length(24).hex().required(),
//     }),
//   }),
// );

// Validating card body
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": "Selection must be made",
    }),
  }),
});

module.exports = {
  updateUserProfileSchema,
  getUserByIdSchema,
  validateClothingItem,
  validateUserSignup,
  validateUserSignin,
  validateClothingItemRouteId,
  validateCardBody,
  validateUrl,
  validateId,
};
