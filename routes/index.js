const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const ERRORS = require("../utils/errors");

router.use("/items", clothingItems);
router.use("/users", users);
// router.use("/users", users);

// router.use((req, res) => {
//   console.log(req.body);
//   res
//     .status(ERRORS.DEFAULT_ERROR.STATUS)
//     .send(ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE);
// });

router.use((req, res) => {
  console.log(req.body);

  res
    .status(ERRORS.NOT_FOUND.STATUS)
    .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
});

// router.use("/items", createClothingItem);
// router.use((req, res) => {
//   console.log(req);
//   console.log(req.body);
// });

module.exports = router;
