"use server";
import { connectDB } from "@/lib/mongodb";
import Voucher from "@/models/Voucher"; // Gantilah dengan model voucher yang sesuai

// Fungsi untuk mendapatkan dan memproses data voucher dengan penyortiran dan penyaringan berdasarkan tahun dan bulan
export const getVouchers = async (sortOrder = "desc", year = null, month = null) => {
  try {
    await connectDB();

    // Buat query filter berdasarkan tahun dan bulan jika disediakan
    let filterQuery = {};
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filterQuery = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    // Menentukan opsi penyortiran berdasarkan `createdAt` dalam urutan yang ditentukan
    const sortOption = sortOrder === "asc" ? 1 : -1;
    const vouchers = await Voucher.find(filterQuery).sort({ createdAt: sortOption });

    const updatedVouchers = vouchers.map((voucher) => {
      const voucherObj = voucher.toObject();
      const createdAtDate = new Date(voucherObj.createdAt);
      const indonesiaTime = new Date(createdAtDate.getTime() + 7 * 60 * 60 * 1000);

      const date = indonesiaTime.toISOString().split("T")[0];
      const time = indonesiaTime.toISOString().split("T")[1].split(".")[0];
      const formattedDateTime = `${date} ${time}`;

      return {
        ...voucherObj,
        formattedCreatedAt: formattedDateTime,
      };
    });

    return {
      vouchers: updatedVouchers,
    };
  } catch (error) {
    console.error(error);
    return { vouchers: [] };
  }
};