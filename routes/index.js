const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const { createUser, login } = require("../controllers/users");

const ERRORS = require("../utils/errors");

const NotFoundError = require("../utils/errorClasses/NotFoundError");

const {
  validateUserSignin,
  validateUserSignup,
} = require("../middlewares/validation");

router.post("/signin", validateUserSignin, login);
router.post("/signup", validateUserSignup, createUser);

router.use("/users", users);
router.use("/items", clothingItems);

router.use((req, res, next) => {
  const error = new NotFoundError(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
  return next(error);
});

module.exports = router;
