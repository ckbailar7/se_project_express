const process = require("process");

const User = require("../models/user");

const ERRORS = require("../utils/errors");

module.exports.getAllUsers = (req, res) => {
  User.find({})

    .then((allUsers) => res.send({ data: allUsers }))
    .catch((err) =>
      res.status(500).send({ message: "Error occured in route /users", err }),
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res
        .status(ERRORS.DEFAULT_ERROR)
        .send(ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE),
    );
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create(name, avatar)
    .then((createdUser) => res.send({ data: createdUser }))
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error occured in route POST /users", err });
    });
};
