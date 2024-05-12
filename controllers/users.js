const bcrypt = require("bcrypt"); // importing bcrypt// importing bcrypt
const jwt = require("jsonwebtoken");
// const { validationResult } = require("express-validator/check");

const User = require("../models/User");

const ERRORS = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getAllUsers = (req, res) => {
  User.find({})

    .then((allUsers) => res.send({ data: allUsers }))

    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};
module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "validatorError" || err.name === "CastError") {
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};

// Step 7 : Search the database for a user using the submitted email; if the user is found, hash the submitted password and compare it to the hash inside the base.
module.exports.updateUserProfile = (req, res) => {
  // This route should only allow modification of the name and avatar fields. You'll need to return an updated object in the response (using the new property).
  const { name, avatar } = req.body;
  const userId = req.params.id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )

    .then(() => {
      res.status(200).send({ name, avatar });
    })
    .catch((err) => err);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: "incorrect email or password" });
    return;
  }

  // try {
  //   const existingUser = await.User.findOne({email});

  //   if(existingUser) {
  //     return res
  //         .status(409)
  //         .send({ message: "User with this email already exists" });
  //   }

  //   const hash = await bcrypt.hash(password, 10);
  //   await User.create({ name, about, avatar, email, password: hash });
  //   res.status(200).send({name, about, avatar, email});
  // } catch (err) {
  //   if (err.name === "ValidationError" || err.name === "CastError") {
  //     return res
  //             .status(ERRORS.INVALID_REQUEST.STATUS)
  //             .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
  //   } else if (err.code === 11000) {
  //     return res
  //       .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
  //       .send({ message: "Email address is already in use" });
  //   }
  //   res
  //     .status(ERRORS.DEFAULT_ERROR.STATUS)
  //     .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
  //     next()
  // }

  User.findOne({ email })
    .then((user) => {
      // Checking to see if the user already exists in the database
      if (user) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }

      return bcrypt

        .hash(password, 10)
        .then((hash) =>
          User.create({ name, about, avatar, email, password: hash }).then(() =>
            res.status(200).send({ name, about, avatar, email }),
          ),
        )
        .catch((err) => {
          if (err.name === "ValidationError" || err.name === "CastError") {
            // console.error(err);
            // removed return statement before res......... below removing breaks postman tests, however is called an error from lintr
            // UPDATE FOR COMMENT ABOVE >> changed the if else block into separate if staemements and that solved the lintr issue while also passing postman tests
            return res
              .status(ERRORS.INVALID_REQUEST.STATUS)
              .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
          }
          if (err.code === 11000) {
            return res
              .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
              .send({ message: "Email address is already in use" });
          }
          res
            .status(ERRORS.DEFAULT_ERROR.STATUS)
            .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
          return err;
        });
    })
    .catch((err) => next(err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
      .send({ message: ERRORS.INVALID_LOGIN_REQUEST.DEFAULT_MESSAGE });
  }

  return User.findUserByCredentials(email, password)

    .then((user) => {
      // user Authentication successfull!!
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      }); //  create webtoken
      // console.log(user);
      // console.log("from login controller => user.name : ", user.name);

      // console.log("token from login controller", { token });
      // res.send({ token });
      res.status(200).send(
        // _id: user._id,
        // email: user.email,

        { token },
      );
      // res.send({ token });
    })
    .catch((err) => {
      res.status(ERRORS.INVALID_REQUEST.STATUS).send({ message: err.message });
    });
};
