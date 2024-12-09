"use server";
import { connectDB } from "@/lib/mongodb";
import Voucher from "@/models/Voucher";

const formatDateToWIB = (date) => {
  const indonesiaTime = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Tambah 7 jam
  const formattedDate = indonesiaTime.toISOString().split("T")[0];
  const formattedTime = indonesiaTime.toISOString().split("T")[1].split(".")[0];
  return `${formattedDate} ${formattedTime}`;
};


export const getVoucherSaldoH = async (sign) => {
    try {
      await connectDB();
  
      // Filter voucher berdasarkan `sign`
      const filterQuery = { sign };
      const vouchers = await Voucher.find(filterQuery);
  
      // Memproses setiap voucher dan transaksi terkait
      const updatedVouchers = vouchers.map((voucher) => {
        const voucherObj = voucher.toObject();
        const HistorySaldo = voucherObj.historySaldo || [];
  
        // Proses setiap transaksi dalam voucher
        const updatedHistorySaldo = HistorySaldo.map((transaction) => {
  
          return {
            ...transaction,
            formattedCreatedAt: formatDateToWIB(new Date(transaction.date)),
          };
        });
  
        return {
          ...voucherObj,
          historyTransaksi: updatedHistorySaldo,
          formattedCreatedAt: formatDateToWIB(new Date(voucherObj.createdAt)),
        };
      });
  
      return { vouchers: updatedVouchers };
    } catch (error) {
      console.error(error);
      return { vouchers: [] };
    }
  };
  