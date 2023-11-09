// creating a router
const router = require("express").Router();

// Import Controllers
const { getAllUsers, getUser, createUser } = require("../controllers/users");

// Route 1 GET /users — returns all users
router.get("/users", getAllUsers);

// Route 2 GET /users/:userId - returns a user by _id

router.get("/users:id", getUser);

// Route 3 POST /users — creates a new user Two fields "In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar."

router.post("/users", createUser);

module.exports = router;
