import mongoose, { Schema, model } from "mongoose";

export interface ITransaction {
  price: number;
  sn: string;
  status: string;
  refId: string;
  details: {
    trxId: string;
    customerNo: string;
    buyerSkuCode: string;
    message: string;
    rc: string;
    buyerLastSaldo: number;
    tele: string;
    wa: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    price: {
      type: Number,
      required: true,
    },
    sn: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },
    refId: {
      type: String,
      required: true,
    },
    details: {
      trxId: { type: String, required: true },
      customerNo: { type: String, required: true },
      buyerSkuCode: { type: String, required: true },
      message: { type: String, required: true },
      rc: { type: String, required: true },
      buyerLastSaldo: { type: Number, required: true },
      tele: { type: String, required: true },
      wa: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure we don't redefine the model if it's already defined
const Transaction = mongoose.models.Transactions || model<ITransaction>("Transactions", transactionSchema);

export default Transaction;
