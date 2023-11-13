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
    .orFail(() => {
      const error = new Error("Error from getClothingItems Not Found");
      error.Statuscode = 404;
    })
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
    .orFail(() => {
      const error = new Error("Could not find that User!");
      error.Statuscode = 400;
    })
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

module.exports.likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }, //adds _id to the array if its not there yet
  );
};

module.exports.dislikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }, //adds _id to the array if its not there yet
  );
};

// module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
//   req.params.itemId,
//   { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
//   { new: true },
// )
// //...

// module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
//   req.params.itemId,
//   { $pull: { likes: req.user._id } }, // remove _id from the array
//   { new: true },
// )
// //...
