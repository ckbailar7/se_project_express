const process = require("process");

const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({});
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);

  const { itemName, weatherType, imageUrl } = req.body;

  ClothingItem.create(itemName, weatherType, imageUrl)
    .then((createdItem) => res.send({ data: createdItem }))
    .catch((err) => {
      res
        .status(ERRORS.DEFAULT_ERROR)
        .send(ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE, err);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .then((deletedItem) => res.send({ data: deletedItem }))
    .catch((err) => {
      res
        .status(ERRORS.DEFAULT_ERROR)
        .send(ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE, err);
    });
};
