const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../utils/errorClasses/BadRequestError");
const ConflictError = require("../utils/errorClasses/ConflictError");
const NotFoundError = require("../utils/errorClasses/NotFoundError");
const UnauthorizedError = require("../utils/errorClasses/UnauthorizedError");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

module.exports.getUser = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("INVALID REQUEST SENT"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("RESOURCE NOT FOUND"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  console.log("Reached updateUserProfile handler");
  console.log(
    "Req.user not recognized logging undefined >>>>> req.user._id",
    req.user._id,
  );
  const { name, avatar } = req.body;
  const userId = req.user._id;
  console.log("Updating user: ", { userId, name, avatar });

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        console.log("User not found", updatedUser);
        return next(new NotFoundError("User not found"));
      }
      console.log("User Updated:", updatedUser);
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      console.error("Error during update : ", err);
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
              const userWithoutPassword = newUser.toObject();
              delete userWithoutPassword.password;

              res.status(200).send({ user: userWithoutPassword });
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid Request sent");
  }

  return User.findUserByCredentials(email, password)

    .then((user) => {
      // user Authentication successfull!!
      console.log("User for JWT signing:", user);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};
