const User = require("../models/user");

const ERRORS = require("../utils/errors");
console.log(ERRORS.INVALID_REQUEST);

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error("Where did they go ?");
      error.Statuscode = 404;
      throw error;
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
  const userId = req.params.id;
  console.log("UserId : >>>", userId);

  User.findById(userId)
    .orFail()

    .then((user) => res.send({ data: user }))
    .catch((err) => {
      //console.log("Begining of catch statement ...");

      if (err.name === "CastError") {
        console.log("This is a cast error");
        console.log("STATUS (err.name)", err.name);
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else if (err.name === "DocumentNotFoundError") {
        console.log("Logging from DocumentNotFoundError block");
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        console.log("SOURCE: {else block } >> This is a default error");
        console.log("Current Error Name : >>>", err);
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log("Hello from createUser");

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

    .catch((err) => {
      console.error("Error : >.....", err.name);

      if (err.name === "ValidationError") {
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
