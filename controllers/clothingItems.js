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
  //console.log(req.body);
  //console.log("Via createClothingItem : user id : >>> ", req.user._id);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((createdItem) => {
      res.send({ data: createdItem });
      //console.log("Hello from then statement");
    })
    .catch((err) => {
      console.error(`Error from catch statement : >>> NAME NAME`, err.name);

      if (err.name === "Not Found") {
        //console.error(err);
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else if (err.name === "ValidationError") {
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  console.log("req.user._id :>>>", userId);

  ClothingItem.findByIdAndRemove(userId)
    .orFail(() => {
      const error = new Error("User Does Not Exist");
      error.status = 400;
      throw error;
    })
    .then((deletedItem) => res.send({ data: deletedItem }))
    .catch((err) => {
      console.log("Catch Statement: <><><><><><><>");
      if (err.name === "Not Found") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      } else if (err.name === "DocumentNotFoundError") {
        console.log();
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else {
        res
          .status(ERRORS.DEFAULT_ERROR.STATUS)
          .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE, err });
      }
    });
};

module.exports.likeClothingItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  console.log(req.params);
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }, //adds _id to the array if its not there yet
  )
    .orFail()
    .then((likedItem) => {
      res.send({ data: likedItem });
    })
    .catch((err) => {
      console.log("<><><><><>Catch Statement Initiated");
      console.log(err.name);
      if (err.name === "CastError") {
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else if (err.name === "DocumentNotFoundError") {
        console.log("YOU gOT IT");
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      }
    });
};

module.exports.dislikeClothingItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }, //adds _id to the array if its not there yet
  )
    .orFail()
    .then((dislikedItem) => {
      res.send({ data: dislikedItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      }
      console.log("Error name from DISLIKE catch <><><><><><> :", err.name);
    });
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
