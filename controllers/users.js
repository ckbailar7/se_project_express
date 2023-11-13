const process = require("process");

const User = require("../models/user");
const { DEFAULT_ERROR } = require("../utils/errors");

const ERRORS = require("../utils/errors");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error("Where did they go ?");
      error.Statuscode = 404;
    })

    .then((allUsers) => res.send({ data: allUsers }))

    .catch((err) => {
      console.log("Error Found in getAllUsers");
      if (err.name === "Not Found") {
        res
          .status(ERRORS.NOT_FOUND)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};
//res.status(500).send({ message: "Error occured in route /users", err }),
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error("Could not find that User!");
      error.Statuscode = 400;
    })

    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "Cast Error") {
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((createdUser) => {
      console.log(createdUser);
      res.send({
        name: createdUser.name,
        about: createdUser.about,
        avatar: createdUser.avatar,
        _id: createdUser._id,
      });
    })

    // .catch((err) => {
    //   console.error(err);
    //   if (err.name === 'SomeErrorName') {
    //     return res.status(SOME_ERROR_CODE).send({ message: "Appropriate error message" })
    //   } else {
    // if no errors match, return a response with status code 500
    //  }

    .catch((err) => {
      if (err.name === "Validation Error") {
        console.log("Error from createUser");
        return res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};
