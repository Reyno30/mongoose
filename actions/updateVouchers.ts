// actions/editVoucherStatus.js
"use server";

import mongoose from "mongoose";
import Voucher from "@/models/Voucher";

export async function updatedVoucher(voucherId, newStatus) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedVoucher) {
      throw new Error("Voucher not found");
    }

    return {
      success: true,
      message: "Voucher status updated successfully",
      voucher: updatedVoucher,
    };
  } catch (error) {
    console.error("Error updating voucher status:", error);
    return { success: false, message: "Error updating voucher status" };
  }
}
