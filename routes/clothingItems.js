// Create a router

const router = require("express").Router();

// Import controllers

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

// Routes

//router.post("/", createItem);

// Route 1 GET /items — returns all clothing items

router.get("/items", getClothingItems);

// Route 2 POST /items — creates a new item
// user should be able to send an item name, weather type, and image URL. They will be passed to the server as a JSON object. You will also need a user ID for the owner field. Move on to the next step to add a user object to each request.

router.post("/items", createClothingItem);

// Route 3 DELETE /items/:itemId — deletes an item by _id

router.delete("/items/:itemId", deleteClothingItem);

module.exports = router;
