const bcrypt = require("bcrypt"); // importing bcrypt// importing bcrypt
const jwt = require("jsonwebtoken");
// const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const ERRORS = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getAllUsers = (req, res) => {
  User.find({})

    .then((allUsers) => res.send({ data: allUsers }))
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERRORS.DEFAULT_ERROR.STATUS)
        .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
    });
};
module.exports.getUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()

    .then((user) => res.send({ data: user }))
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
  const userId = req.params.id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "validatorError" || err.name === "CastError") {
        console.error(err);
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
    { new: true, runValidators: true },
  )

    .then(() => {
      res.status(200).send({ name, avatar });
    })
    .catch((err) => {
      console.log("Location of Error", err);
    });

  // (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     res
  //       .status(ERRORS.INVALID_REQUEST.STATUS)
  //       .send(ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE);
  //   } else if (err.name === "ValidationError" || err.name === "CastError") {
  //     console.error(err);
  //     res
  //       .status(ERRORS.INVALID_REQUEST.STATUS)
  //       .send(ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE);
  //   } else if (err.name === "DocumentNotFoundError") {
  //     res
  //       .status(ERRORS.NOT_FOUND.STATUS)
  //       .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
  //   } else {
  //     console.log(data);
  //     res.send(data);
  //   }
  // },
  // );
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: "incorrect email or password" });
    //RETURN STATEMENT NEEDED <><>
    return;
  }

  return User.findOne({ email }).then((user) => {
    // Checking to see if the user already exists in the database
    if (user) {
      return res
        .status(409)
        .send({ message: "User with this email already exists" });
    }

    return bcrypt
      .hash(password, 10)
      .then((hash) =>
        User.create({ name, about, avatar, email, password: hash }).then(
          ({ name, about, avatar, email }) => {
            return res.status(200).send({ name, about, avatar, email });
          },
        ),
      )
      .catch((err) => {
        if (err.name === "ValidationError" || err.name === "CastError") {
          //console.error(err);
          return res
            .status(ERRORS.INVALID_REQUEST.STATUS)
            .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
        } else if (err.status === 11000) {
          res
            .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
            .send({ message: ERRORS.INVALID_LOGIN_REQUEST.DEFAULT_MESSAGE });
        } else {
          res
            .status(ERRORS.DEFAULT_ERROR.STATUS)
            .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
          return err;
        }
      });
  });
};

// module.exports.createUserCHECKCHECK = (req, res) => {
//   const { name, about, avatar, email, password } = req.body;
//   if (!email || !password) {
//     res.status(400).send({ message: "incorrect email or password" });
//   }
//   User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         return res
//           .status(409)
//           .send({ message: "User with this email already exists" });
//       }
//       bcrypt.hash(password, 10)
//       .then((hash) => {
//       User.create({ name, about, avatar, email, password: hash })
//         .then((data) => res.status(200).send({data: data})
//     }
//   })
//         .catch((err) => {
//           console.log(err.name, "ERROR NAME HERE <><><><<><><><><><><><><>");
//           console.log("TESTING LOCATION", err);

//           if (err.name === "ValidationError" || err.name === "CastError") {
//             console.log(err.name);
//             console.log("error CHECK Validation and Cast<><><><><><>");
//             return res
//               .status(ERRORS.INVALID_REQUEST.STATUS)
//               .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
//           } else if (err.status === 11000) {
//             res
//               .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
//               .send({ message: ERRORS.INVALID_LOGIN_REQUEST.DEFAULT_MESSAGE });
//           } else {
//             console.log("ERROR NAME LOCATION <><><><><><><><>");
//             res
//               .status(ERRORS.DEFAULT_ERROR.STATUS)
//               .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
//             return err;
//           }
//           res
//             .status(ERRORS.INVALID_REQUEST.STATUS)
//             .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
//         });
//     );
// };

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERRORS.INVALID_LOGIN_REQUEST.STATUS)
      .send({ message: ERRORS.INVALID_LOGIN_REQUEST.DEFAULT_MESSAGE });
  }

  return User.findUserByCredentials(email, password)

    .then((user) => {
      //user Authentication successfull!!
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      }); //  create webtoken
      // console.log(user);
      console.log("from login controller => user.name : ", user.name);

      console.log("token from login controller", { token });
      //res.send({ token });
      res.status(200).send(
        // _id: user._id,
        // email: user.email,

        { token },
      );
      //res.send({ token });
    })
    .catch((err) => {
      res.status(ERRORS.INVALID_REQUEST.STATUS).send({ message: err.message });
    });
};
