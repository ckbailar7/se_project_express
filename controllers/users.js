const bcrypt = require("bcrypt"); // importing bcrypt// importing bcrypt
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const ERRORS = require("../utils/errors");
const JWT_SECRET = require("../utils/config");

module.exports.getAllUsers = (req, res) => {
  User.find({})

    .then((allUsers) => res.send({ data: allUsers }))

    .catch(() => {
      res
        .status(ERRORS.DEFAULT_ERROR.STATUS)
        .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
    });
};
module.exports.getUser = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .orFail()

    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
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
  const userId = req.params.id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        console.err(err);
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

//Step 7 : Search the database for a user using the submitted email; if the user is found, hash the submitted password and compare it to the hash inside the base.
module.exports.updateUserProfile = (req, res) => {
  //This route should only allow modification of the name and avatar fields. You'll need to return an updated object in the response (using the new property).
  const { name, avatar } = req.body;
  const userId = req.params.id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true },
    (err, data) => {
      if (err) {
        console.error(err);
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send(ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE);
      } else if (err.name === "ValidationError" || err.name === "CastError") {
        console.error(err);
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send(ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE);
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        console.log(data);
        res.send(data);
      }
    },
  );
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) {
    res.status(401).send({ message: "incorrect email or password" });
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash });
    })
    .then((user) => res.send(user))

    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        console.log(err.name);
        return res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else if (err.status === 11000) {
        res
          .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_LOGIN_REQUEST.DEFAULT_MESSAGE });
      } else {
        console.log("ERROR NAME LOCATION <><><><><><><><>");
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
        return err;
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)

    .then((user) => {
      //user Authentication successfull!!
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      }); //  create webtoken

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {};
