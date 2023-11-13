const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
    required: true,
  },
  imageUrl: {
    type: String,
    validate: {
      validator(value) {
        return validator.isUrl(value);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const clothingItem = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     required: true,
//   },
//   weather: {
//     type: String,
//     enum: ["hot", "warm", "cold"],
//     required: true,
//   },

//   imageUrl: {
//     type: String,
//     validate: {
//       validator(value) {
//         return validator.isUrl(value);
//       },
//     },
//   },
// });

module.exports = mongoose.model("clothingItem", clothingItem);
