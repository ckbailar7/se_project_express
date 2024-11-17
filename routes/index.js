const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const { createUser, login } = require("../controllers/users");

const ERRORS = require("../utils/errors");

const NotFoundError = require("../utils/errorClasses/NotFoundError");

const {
  validateUserSignin,
  validateUserSignup,
} = require("../middlewares/validation");

// ROUTES NOT NEEDING PROTECTION
router.post("/signin", validateUserSignin, login);
router.post("/signup", validateUserSignup, createUser);

// ROUTES NEEDING PROTECTION
// router.use(auth);
router.use("/users", users);
router.use("/items", clothingItems);

router.use((req, res, next) => {
  const error = new NotFoundError(ERRORS.NOT_FOUND.DEFAULT_MESSAGE);
  return next(error);
});

module.exports = router;

// Total list of routes in use that need Protected with authorization : >>> 5

// router.use("/users", users); -- good

// router.post("/", createClothingItem); -- good

// router.delete("/:itemId", deleteClothingItem); -- good

// router.put("/:itemId/likes", likeClothingItem); -- good

// router.delete("/:itemId/likes", dislikeClothingItem); -- good

// ROUTES NOT NEEDING AUTH
// POST /signin -- Located in index.js
// POST /signup -- Located in index.js
// GET /items -- Located in Routes/clothingItems
