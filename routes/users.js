// creating a router
const router = require("express").Router();

// Import Controllers
const {
  getCurrentUser,
  updateUser,
  getAllUsers,
  getUser,
  createUser,
} = require("../controllers/users");

// Route 1 GET /users — returns all users
// router.get("/", getAllUsers);
//With user authorization , we cannot access other profiles

// Route 2 GET /users/:userId - returns a user by _id

// router.get("/:id", getUser);

// Route 3 POST /users — creates a new user Two fields "In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar."

// router.post("/", createUser);
//now we create a user by signing up

//CREATE GET/users/me ROUTE STEP 6 Proj 13<><><>
router.get("/users/me", getCurrentUser);

// STEP 7 <><><> PATCH /users/me — update profile
//router.patch("/users/me", updateUser);

module.exports = router;
