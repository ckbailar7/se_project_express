const User = require("../models/user");

const ERRORS = require("../utils/errors");

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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((createdUser) => {
      res.send({
        name: createdUser.name,
        about: createdUser.about,
        avatar: createdUser.avatar,
        _id: createdUser._id,
      });
    })

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      }
      res
        .status(ERRORS.DEFAULT_ERROR.STATUS)
        .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      return err;
    });
};
