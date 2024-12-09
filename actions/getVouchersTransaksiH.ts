"use server";

import { connectDB } from "@/lib/mongodb";
import Voucher from "@/models/Voucher";

// Fungsi untuk memformat tanggal ke zona waktu WIB
const formatDateToWIB = (date: Date): string => {
  const indonesiaTime = new Date(date.getTime() + 7 * 60 * 60 * 1000); // Tambahkan 7 jam
  const formattedDate = indonesiaTime.toISOString().split("T")[0];
  const formattedTime = indonesiaTime.toISOString().split("T")[1].split(".")[0];
  return `${formattedDate} ${formattedTime}`;
};

// Fungsi untuk mendapatkan transaksi voucher dengan penyortiran dan penyaringan
export const getVouchersTransaksiH = async (
  sign: string,
  sortOrder: "asc" | "desc" = "desc",
  year: string | null = null,
  month: string | null = null
) => {
  try {
    await connectDB();
    console.log(`[INFO] Fetching vouchers for sign: ${sign}`);

    // Ambil data voucher berdasarkan `sign`
    const vouchers = await Voucher.find({ sign });

    if (vouchers.length === 0) {
      console.log(`[INFO] No vouchers found for sign: ${sign}`);
    }

    let totalGrossProfit = 0; // Inisialisasi total gross profit

    const processedVouchers = vouchers.map((voucher) => {
      const historyTransaksi = voucher.historyTransaksi || [];

      if (historyTransaksi.length === 0) {
        console.log(`[INFO] Voucher ${voucher._id} has no transactions.`);
      }

      // Filter transaksi berdasarkan tahun dan bulan
      const filteredHistory = historyTransaksi.filter((transaction) => {
        const transactionDate = transaction.date
          ? new Date(transaction.date)
          : null;

        if (!transactionDate || isNaN(transactionDate.getTime())) {
          console.warn(
            `[WARNING] Invalid or missing date for transaction in voucher ${voucher._id}.`
          );
          return false;
        }

        // Filter tahun
        if (year && transactionDate.getFullYear() !== parseInt(year)) {
          return false;
        }

        // Filter bulan
        if (month && transactionDate.getMonth() + 1 !== parseInt(month)) {
          return false;
        }

        return true;
      });

      // Sort transaksi berdasarkan tanggal
      const sortedHistory = filteredHistory.sort((a, b) => {
        const dateA = new Date(a.date || "");
        const dateB = new Date(b.date || "");
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });

      // Hitung gross profit
      const grossProfit = sortedHistory.reduce((acc, transaction) => {
        const price = transaction.details?.price || 0;
        return acc + price;
      }, 0);

      totalGrossProfit += grossProfit;

      return {
        ...voucher.toObject(),
        historyTransaksi: sortedHistory.map((transaction) => ({
          ...transaction,
          formattedDate: transaction.date
            ? formatDateToWIB(new Date(transaction.date))
            : null,
          _id: transaction._id.toString(), // Konversi ObjectId ke string
        })),
        grossProfit,
      };
    });

    console.log("[INFO] Processed Vouchers:", processedVouchers);
    console.log("[INFO] Total Gross Profit:", totalGrossProfit);

    return {
      vouchers: processedVouchers,
      totalGrossProfit,
    };
  } catch (error) {
    console.error("[ERROR] Error fetching vouchers:", error);
    return { vouchers: [], totalGrossProfit: 0 };
  }
};
