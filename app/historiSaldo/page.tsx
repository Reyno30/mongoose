"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getVoucherSaldoH } from "@/actions/getVoucherSaldoH";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VouchersPage = () => {
  const searchParams = useSearchParams();
  const sign = searchParams.get("sign");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0); // State untuk total amount
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Urutan default DESC
  const [selectedYear, setSelectedYear] = useState<number>(2024); // Default ke 2024
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Default ke Januari
  const { status } = useSession();
  const router = useRouter();

  const years = [
    ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    const fetchVouchers = async () => {
      if (sign) {
        try {
          const response = await getVoucherSaldoH(sign);
          setVouchers(response.vouchers || []);
        } catch (error) {
          console.error("Error fetching vouchers:", error);
        }
      }
    };

    fetchVouchers();
  }, [sign]);

  useEffect(() => {
    const filterAndSortVouchers = () => {
      // Filter berdasarkan tahun dan bulan yang dipilih
      const filtered = vouchers.filter((voucher) =>
        voucher.historyTransaksi.some((transaction) => {
          const transactionDate = new Date(transaction.formattedCreatedAt);
          return (
            transactionDate.getFullYear() === selectedYear &&
            transactionDate.getMonth() + 1 === selectedMonth
          );
        })
      );

      // Jumlahkan semua Amount dari semua transaksi
      let total = 0;
      filtered.forEach((voucher) => {
        voucher.historyTransaksi.forEach((transaction) => {
          total += parseFloat(transaction.amount || "0"); // Menggunakan parseFloat untuk menjumlahkan angka
        });
      });

      // Mengurutkan vouchers berdasarkan Amount
      const sortedVouchers = filtered.map((voucher) => ({
        ...voucher,
        historyTransaksi: voucher.historyTransaksi
          .slice()
          .sort((a, b) => {
            const amountA = parseFloat(a.amount || "0");
            const amountB = parseFloat(b.amount || "0");
            return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
          }),
      }));

      setTotalAmount(total); // Menyimpan total amount
      setFilteredVouchers(sortedVouchers);
    };

    filterAndSortVouchers();
  }, [selectedYear, selectedMonth, vouchers, sortOrder]);

  const sortByAmount = () => {
    // Toggle urutan pengurutan Amount (ASC <-> DESC)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const renderSessionContent = () => {
    if (status === "authenticated") {
      return (
        <div className="w-full h-full">
          <Table>
            <TableCaption>A list of history vouchers transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Note</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date Time</TableHead>
                <TableHead className="text-right">RC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No vouchers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVouchers.map((voucher) =>
                  voucher.historyTransaksi.map((transaction, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{transaction?.note || "N/A"}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(parseFloat(transaction?.amount || "0"))}
                      </TableCell>
                      <TableCell>{transaction.formattedCreatedAt}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(parseFloat(transaction?.rc || "0"))}
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
            <TableFooter />
          </Table>
        </div>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      router.push("/login");
      return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-3">
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary">
          <Link href="/voucher">BACK</Link>
        </Button>
        
        {/* Tampilan Total Amount seperti tombol */}
        <Button variant="outline" className="px-4 py-2 rounded-lg">
          Total Amount:{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(totalAmount)}
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Dropdown Tahun */}
        <div className="flex items-center">
          <select
            className="mr-4 p-2 border rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Dropdown Bulan */}
          <select
            className="mr-4 p-2 border rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {/* Tombol Sort by Amount */}
          <Button variant="primary" onClick={sortByAmount}>
            Sort by Amount ({sortOrder.toUpperCase()})
          </Button>
        </div>
      </div>

      {renderSessionContent()}
    </main>
  );
};

export default VouchersPage;
