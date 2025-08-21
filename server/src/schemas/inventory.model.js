import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    // unit: {
    //   type: String,
    //   required: true,
    // },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    updatedDate: {
      type: Date,
      default: null,
    },
    purchaseTime: [],
    supplier: {
      type: String,
    },
    status: {
      type: String,
      default: "In Stock",
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
