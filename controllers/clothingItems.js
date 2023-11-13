const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

// module.exports.createItem = (req, res) => {
//   console.log(req.body);
//   console.log(req.user._id);

//   const { itemName, weatherType, imageUrl } = req.body;
//   ClothingItem.create({ itemName, weatherType, imageUrl })
//     .then((item) => {
//       console.log(item);
//       res.send({ data: item });
//     })
//     .catch((err) => {
//       res.status(500).send({ message: "Error from createItem", err });
//     });
// };

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send({
        data: items,
      });
    })
    .catch((err) => {
      if (err.name === "Not Found") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);

  const { itemName, weatherType, imageUrl } = req.body;

  ClothingItem.create(itemName, weatherType, imageUrl)
    .then((createdItem) => res.send({ data: createdItem }))
    .catch((err) => {
      if (err.name === "Not Found") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        res

          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .then((deletedItem) => res.send({ data: deletedItem }))
    .catch((err) => {
      if (err.name === "Not Found") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE, err });
      }
    });
};
