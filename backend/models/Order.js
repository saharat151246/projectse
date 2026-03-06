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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        price: Number, // snapshot ราคา
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Transfer", "CreditCard"],
    },
    paidAt: Date,
    transactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);