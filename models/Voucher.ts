import mongoose, { Schema, model } from "mongoose";

export interface IVoucher {
  status: boolean;
  totalSaldo: number;
  historySaldo: {
    date: Date;
    amount: string;
    note: string;
    rc: string;
  }[];
  historyTransaksi: {
    date: Date;
    note: string;
    details: {
      trx_id: string;
      ref_id: string;
      customer_no: string;
      buyer_sku_code: string;
      message: string;
      status: string;
      rc: string;
      buyer_last_saldo: number;
      sn: string;
      price: number;
      tele: string;
      wa: string;
    };
  }[];
  code: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  saldoMinus: number;
  name: string;
  sign: string;
}

const voucherSchema = new Schema<IVoucher>(
  {
    status: {
      type: Boolean,
      required: true,
    },
    totalSaldo: {
      type: Number,
      required: true,
    },
    historySaldo: [
      {
        date: { type: Date, required: true },
        amount: { type: String, required: true },
        note: { type: String, required: true },
        rc: { type: String, required: true },
      },
    ],
    historyTransaksi: [
      {
        date: { type: Date, required: true },
        note: { type: String, required: true },
        details: {
          trx_id: { type: String, required: true },
          ref_id: { type: String, required: true },
          customer_no: { type: String, required: true },
          buyer_sku_code: { type: String, required: true },
          message: { type: String, required: true },
          status: { type: String, required: true },
          rc: { type: String, required: true },
          buyer_last_saldo: { type: Number, required: true },
          sn: { type: String, required: true },
          price: { type: Number, required: true },
          tele: { type: String, required: true },
          wa: { type: String, required: true },
        },
      },
    ],
    code: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    saldoMinus: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sign: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.models.Vouchers || model<IVoucher>("Vouchers", voucherSchema);

export default Voucher;
