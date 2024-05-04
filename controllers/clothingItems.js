const ClothingItem = require("../models/clothingItem");
const ERRORS = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send({
        data: items,
      });
    })
    .catch(() => {
      res
        .status(ERRORS.DEFAULT_ERROR.STATUS)
        .send({ message: ERRORS.DEFAULT_ERROR.DEFAULT_MESSAGE });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((createdItem) => {
      res.send({ data: createdItem });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
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
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//

module.exports.deleteClothingItem428 = (req, res) => {
  //const { clothingId } = req.params;
  const currentUser = req.user;

  // Begin search
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      // if item is not found in DB
      if (!item) {
        return res
          .status(ERRORS.NOT_FOUND.STATUS)
          .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
      }

      // check if item is owned by current user
      if (!item.owner.equals(currentUser._id)) {
        return res
          .status(ERRORS.FORBIDDEN.STATUS)
          .send({ message: ERRORS.FORBIDDEN.DEFAULT_MESSAGE });
      }

      // Delete Item if if()statements are ignored ie item being deleted is owned by user
      return ClothingItem.findByIdAndRemove(req.params.itemId)
        .then(() => {
          res.status(200).send({ message: "Item Deleted Successfully" });
        })
        .catch((err) => {
          //console.error(err);
          if (err.name === "CastError") {
            res
              .status(ERRORS.INVALID_REQUEST.STATUS)
              .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
          } else if (err.name === "DocumentNotFoundError") {
            res
              .status(ERRORS.NOT_FOUND.STATUS)
              .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
          }
        });
    });
};

//
//
//
//
//
//
//
//
//
//
//

// module.exports.deleteClothingItem = (req, res) => {
//   console.log(req.params);
//   // const { clothingId } = req.params.itemId;
//   // const currentUser = req.user._id;
//   // const owner = req.params.owner;
//   ClothingItem.findById(req.params)
//     .orFail()
//     .then((data) => {
//       if (!data) {
//         res
//           .status(ERRORS.NOT_FOUND.STATUS)
//           .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
//       }
//       if (!data.owner.equals(currentUser)) {
//         return res
//           .status(ERRORS.FORBIDDEN.STATUS)
//           .send({ message: ERRORS.FORBIDDEN.DEFAULT_MESSAGE });
//       }
//       return ClothingItem.findByIdAndRemove(req.params)
//         .then(() => {
//           res.status(200).send({ message: "Item Deleted Successfully" });
//         })
//         .catch((err) => {
//           if (err.name === "CastError") {
//             res
//               .status(ERRORS.INVALID_REQUEST.STATUS)
//               .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
//           } else if (err.name === "DocumentNotFoundError") {
//             res
//               .status(ERRORS.NOT_FOUND.STATUS)
//               .send({ message: ERRORS.NOT_FOUND.DEFAULT_MESSAGE });
//           }
//         });
//     });
// };

module.exports.likeClothingItem = (req, res) => {
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
        res
          .status(ERRORS.INVALID_REQUEST.STATUS)
          .send({ message: ERRORS.INVALID_REQUEST.DEFAULT_MESSAGE });
      } else if (err.name === "DocumentNotFoundError") {
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
    { new: true }, // adds _id to the array if its not there yet
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
    });
};
