const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
  deleteClothingItemUPDATED,
  deleteClothingItem428,
} = require("../controllers/clothingItems");

//ROUTES NOT NEEDING PROTECTION
router.get("/", getClothingItems);

//ROUTES NEEDING PROTECTION
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem428);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", dislikeClothingItem);

module.exports = router;
