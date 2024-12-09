import mongoose, { Schema, model } from "mongoose";

// Define the interface for the transaction document
export interface TransactionDocument {
  _id: string;
  price: number;
  sn: string;
  status: string;
  refId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the transaction document
const TransactionSchema = new Schema<TransactionDocument>(
  {
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    sn: {
      type: String,
      required: [true, "Serial Number (SN) is required"],
      unique: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
    },
    refId: {
      type: String,
      required: [true, "Reference ID is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the transaction model
const Transaction =
  mongoose.models?.Transaction || model<TransactionDocument>("Transaction", TransactionSchema);
export default Transaction;
