"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getVouchersTransaksiH } from "@/actions/getVouchersTransaksiH";
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
  const [vouchers, setVouchers] = useState([]);
  const [totalGrossProfit, setTotalGrossProfit] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const { status } = useSession();
  const router = useRouter();

  // Generate years dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Month options
  const months = [
    { label: "All", value: null },
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  useEffect(() => {
    const fetchVouchers = async () => {
      if (sign) {
        try {
          const response = await getVouchersTransaksiH(
            sign,
            sortOrder,
            selectedYear,
            selectedMonth
          );
          setVouchers(response.vouchers || []);
          setTotalGrossProfit(response.totalGrossProfit || 0);
        } catch (error) {
          console.error("Error fetching vouchers:", error);
        }
      }
    };

    fetchVouchers();
  }, [sign, sortOrder, selectedYear, selectedMonth]);

  const renderSessionContent = () => {
    if (status === "authenticated") {
      return (
        <div className="w-full h-full">
          {/* Filter controls */}
          <div className="mb-4 flex items-center gap-4">
            <label>
              Year:
              <select
                value={selectedYear || "All"}
                onChange={(e) =>
                  setSelectedYear(e.target.value === "All" ? null : e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                <option value="All">All</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Month:
              <select
                value={selectedMonth || "All"}
                onChange={(e) =>
                  setSelectedMonth(e.target.value === "All" ? null : e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              variant="primary"
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
            >
              Sort: {sortOrder === "desc" ? "Descending" : "Ascending"}
            </Button>
          </div>

          {/* Total Gross Profit */}
          <div className="mb-4 font-bold text-lg">
            Total Gross Profit: {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalGrossProfit)}
          </div>

          {/* Table display */}
          <Table>
            <TableCaption>
              A list of history vouchers transactions.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Date Time</TableHead>
                <TableHead className="text-right">Gross Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No vouchers found.
                  </TableCell>
                </TableRow>
              ) : (
                vouchers.map((voucher, voucherIdx) =>
                  voucher.historyTransaksi.map((transaction, idx) => (
                    <TableRow key={`${voucher._id}-${idx}`}>
                      <TableCell>{transaction.details?.sn || "N/A"}</TableCell>
                      <TableCell>
                        {transaction.details?.status || "Error"}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(transaction.details?.price || 0)}
                      </TableCell>
                      <TableCell>{transaction.formattedDate || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(transaction.grossProfit || 0)}
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
      <div>
        <Button variant="secondary">
          <Link href="/voucher">BACK</Link>
        </Button>
      </div>
      {renderSessionContent()}
    </main>
  );
};

export default VouchersPage;
