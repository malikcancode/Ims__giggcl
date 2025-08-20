import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    inventoryRequests: [
      {
        inventoryItem: {
          type: String,
          required: true,
        },
        quantity: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        requestedAt: { type: Date, default: Date.now },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
