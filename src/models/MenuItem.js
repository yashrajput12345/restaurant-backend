const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Item availability
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ⭐ Trending flag
    isTrending: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);