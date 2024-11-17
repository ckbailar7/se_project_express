const router = require("express").Router();
const { celebrate } = require("celebrate");

const auth = require("../middlewares/auth");

const { updateUserProfile, getUser } = require("../controllers/users");

const { updateUserProfileSchema } = require("../middlewares/validation");

router.get("/me", auth, getUser);

router.patch(
  "/me",
  celebrate({ body: updateUserProfileSchema }),
  updateUserProfile,
);

module.exports = router;
