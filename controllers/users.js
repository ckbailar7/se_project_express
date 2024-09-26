const bcrypt = require("bcrypt"); // importing bcrypt// importing bcrypt
const jwt = require("jsonwebtoken");
const BadRequestError = require("../utils/errorClasses/BadRequestError.js");
const ConflictError = require("../utils/errorClasses/ConflictError.js");
const ForbiddenError = require("../utils/errorClasses/ForbiddenError.js");
const NotFoundError = require("../utils/errorClasses/NotFoundError.js");
const UnauthorizedError = require("../utils/errorClasses/UnauthorizedError.js");
const User = require("../models/user");

const ERRORS = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("INVALID REQUEST SENT"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then(() => {
      res.status(200).send({ name, avatar, _id: userId });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation Error"));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Incorrect email or password");
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          "User with this email already exists in this database",
        );
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({ name, about, avatar, email, password: hash }).then(
            (newUser) => {
              res.status(200).send({ user: newUser });
            },
          ),
        )
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "CastError") {
            next(new BadRequestError("Invalid request data"));
          } else if (err.code === 11000) {
            next(new ConflictError("Email address is already in use"));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid Request sent");
  }

  return User.findUserByCredentials(email, password)

    .then((user) => {
      // user Authentication successfull!!
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(new BadRequestError("Invalid request sent"));
      }
    });
};
