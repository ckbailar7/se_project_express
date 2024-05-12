const router = require("express").Router();

const auth = require("../middlewares/auth");
// const users = require("./users");
// creating a router

// Import Controllers
const {
  // getCurrentUser,
  updateUserProfile,
  // getAllUsers,
  getUser,
  // createUser,
} = require("../controllers/users");

// Route 1 GET /users — returns all users
router.get("/me", auth, getUser);
// With user authorization , we cannot access other profiles

// Route 2 GET /users/:userId - returns a user by _id

// router.get("/:id", getUser);

// Route 3 POST /users — creates a new user Two fields "In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar."

// router.post("/", createUser);
// now we create a user by signing up

// CREATE GET/users/me ROUTE STEP 6 Proj 13<><><>
// router.get("/me", auth, getCurrentUser);

// STEP 7 <><><> PATCH /users/me — update profile
router.patch("/me", updateUserProfile);

module.exports = router;
