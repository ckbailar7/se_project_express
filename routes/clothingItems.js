const router = require("express").Router();

const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

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
router.post("/", auth, validateClothingItem, createClothingItem);
router.delete("/:itemId", auth, validateId, deleteClothingItem);
router.put("/:itemId/likes", auth, validateId, likeClothingItem);
router.delete("/:itemId/likes", auth, validateId, dislikeClothingItem);

module.exports = router;
