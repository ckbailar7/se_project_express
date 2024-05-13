const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  // deleteClothingItemUPDATED,
  // deleteClothingItem428,
} = require("../controllers/clothingItems");

// ROUTES NOT NEEDING PROTECTION
router.get("/", getClothingItems);

// ROUTES NEEDING PROTECTION
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/:itemId/likes", auth, likeClothingItem);
router.delete("/:itemId/likes", auth, dislikeClothingItem);

module.exports = router;
