const router = require("express").Router();
const { celebrate } = require("celebrate");

const auth = require("../middlewares/auth");

const { updateUserProfile, getUser } = require("../controllers/users");

const { updateUserProfileSchema } = require("../middlewares/validation");

router.get("/me", auth, getUser);

router.patch(
  "/me",
  auth,
  celebrate({ body: updateUserProfileSchema }),
  (req, res, next) => {
    console.log("PATCH request to /users/me recieved data: ", req.body);
    next();
  },
  updateUserProfile,
);

module.exports = router;
