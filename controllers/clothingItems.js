const mongoose = require("mongoose");
const BadRequestError = require("../utils/errorClasses/BadRequestError.js");
const ConflictError = require("../utils/errorClasses/ConflictError.js");
const ForbiddenError = require("../utils/errorClasses/ForbiddenError.js");
const NotFoundError = require("../utils/errorClasses/NotFoundError.js");
const UnauthorizedError = require("../utils/errorClasses/UnauthorizedError.js");

const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send({
        data: items,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((createdItem) => {
      res.send({ data: createdItem });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data request"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  // const { clothingId } = req.params;

  const currentUser = req.user;

  // Extract the item ID from req.params
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId) || !itemId) {
    // if response needed is not found
    throw new BadRequestError("Invalid request");
  }

  // Begin search
  ClothingItem.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      // if item is not found in DB
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      // check if item is owned by current user
      if (!item.owner.equals(currentUser._id)) {
        throw new ForbiddenError("Item is not owned by owner");
      }

      // Delete Item if if()statements are ignored ie item being deleted is owned by user
      return ClothingItem.findByIdAndRemove({ _id: itemId })
        .then(() =>
          res.status(200).send({ message: "Item Deleted Successfully" }),
        )
        .catch((err) => {
          // console.error(err);
          if (err.name === "CastError") {
            next(new BadRequestError("Invalid request"));
          } else if (err.name === "DocumentNotFoundError") {
            next(new NotFoundError("Not found"));
          }
        });
    })
    .catch((err) => {
      // console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not found"));
      } else {
        next(err);
      }
    });
  return false;
};

module.exports.likeClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }, // adds _id to the array if its not there yet
  )
    .orFail()
    .then((likedItem) => {
      res.send({ data: likedItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data request"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Document not found"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeClothingItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }, // adds _id to the array if its not there yet
  )
    .orFail()
    .then((dislikedItem) => {
      res.send({ data: dislikedItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data request"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not found"));
      } else {
        next(err);
      }
    });
};
