// actions/deleteVoucher.js
"use server";

import mongoose from "mongoose";
import Voucher from "@/models/Voucher";

export async function deleteVoucher(voucherId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);

    if (!deletedVoucher) {
      throw new Error("Voucher not found");
    }

    return {
      success: true,
      message: "Voucher deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return { success: false, message: "Error deleting voucher" };
  }
}
