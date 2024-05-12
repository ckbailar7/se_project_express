const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

const ERRORS = require("../utils/errors");

// ROUTES NOT NEEDING PROTECTION
router.post("/signin", login);
router.post("/signup", createUser);

// ROUTES NEEDING PROTECTION
router.use(auth);
router.use("/users", users);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(ERRORS.NOT_FOUND.STATUS).send({ message: "Route not found" });
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
