const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const ERRORS = require("../utils/errors");

router.use("/items", clothingItems);
router.use("/users", users);

router.use((req, res) => {
  res
    .status(ERRORS.NOT_FOUND.STATUS)
    .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
});

module.exports = router;
