// Import validator and celebrate there, together with Joi:
const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const router = require("../routes");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string url");
};

// Validating Route for creating a clothing item
router.post(
  "/",
  celebrate({
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
  }),
);

// Validating user info body when user is created
router.post(
  "/signup",
  celebrate({
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
  }),
);

// Validating Route for signing in a user
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
);

// Validate route for fetching user ids when they are accessed
router.use(
  "/users",
  celebrate({
    body: Joi.object.keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
);

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

// Validating route for fetching clothing item ids when they are accessed
router.use(
  "items",
  celebrate({
    body: Joi.object.keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
);
