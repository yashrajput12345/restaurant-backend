const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // ⭐ NEW FIELD
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      default: "online",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "preparing", "out_for_delivery", "delivered"],
      default: "placed",
    },

    address: {
      type: String,
      required: true,
    },

    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);