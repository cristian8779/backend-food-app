const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pendiente", "completado", "cancelado"], default: "pendiente" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
