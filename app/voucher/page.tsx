"use client";

import { GalleryVerticalEnd, Minus, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getVouchers } from "@/actions/getVouchers";
import { updateVoucherStatus, deleteVoucherById } from "@/actions/getVouchers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
// This is sample data.
const data = {
  navMain: [
    {
      title: "Base",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/",
        },
        {
          title: "Transactions",
          url: "/transactions",
        },
      ],
    },
    {
      title: "Extra",
      url: "#",
      items: [
        {
          title: "Vouchers",
          url: "/voucher",
          isActive: true,
        },
        {
          title: "Data Fetching",
          url: "#",
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
};

export default function Component() {
  const { status } = useSession();
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const fetchVouchers = async () => {
    try {
      const response = await getVouchers(
        sortOrder,
        selectedYear === "All" ? null : selectedYear,
        selectedMonth === "All" ? null : selectedMonth
      );
      setVouchers(response.vouchers);
      console.log("Updated Vouchers State:", response.vouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchVouchers();
    }
  }, [status, sortOrder, selectedYear, selectedMonth]);

  const handleEditStatus = async (id: string, newStatus: boolean) => {
    try {
      await updateVoucherStatus(id, newStatus);
      console.log("Voucher updated");

      // Refresh vouchers after editing
      fetchVouchers();
    } catch (error) {
      console.error("Error updating voucher:", error);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    try {
      await deleteVoucherById(id);
      console.log("Voucher deleted");

      // Refresh vouchers after deletion
      fetchVouchers();
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) =>
      prevSortOrder === "desc" ? "asc" : "desc"
    );
  };

  const years = [
    ...Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
    "All",
  ];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  if (status === "loading") {
    return <span className="text-[#888] text-sm mt-7">Loading...</span>;
  }

  if (status !== "authenticated") {
    window.location.href = "/login";
    return null;
  }
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Documentation</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <form>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <SidebarInput
                  id="search"
                  placeholder="Search the docs..."
                  className="pl-8"
                />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((item, index) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 1}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}{" "}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={item.isActive}
                              >
                                <a href={item.url}>{item.title}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex justify-between">
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Extra</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Vouchers</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <Button
              asChild
              variant="secondary"
              onClick={() => {
                signOut({ redirect: false }).then(() => {
                  router.push("/");
                });
              }}
            >
              <Link href="/">Log out</Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-wrap gap-4 p-4">
          <div className="mb-4 flex gap-2">
            <Button variant="secondary" onClick={toggleSortOrder}>
              Sort by Date ({sortOrder === "asc" ? "Descending" : "Ascending"})
            </Button>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <Table>
            <TableCaption>A list of transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Saldo</TableHead>
                <TableHead className="text-right">Saldo Minus</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((voucher) => {
                return (
                  <TableRow key={voucher._id}>
                    <TableCell>{voucher.code || "0"}</TableCell>
                    <TableCell>{voucher.name || "null"}</TableCell>
                    <TableCell>{voucher.status ? "True" : "False"}</TableCell>
                    <TableCell className="text-right">
                      {voucher.totalSaldo
                        ? voucher.totalSaldo.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                        : "0"}
                    </TableCell>
                    <TableCell className="text-right">
                      {voucher.saldoMinus
                        ? voucher.saldoMinus.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })
                        : "0"}
                    </TableCell>
                    <TableCell>{voucher.phoneNumber || "null"}</TableCell>
                    <TableCell>
                      <Button
                        asChild
                        variant="secondary"
                        onClick={() => {
                            router.push("/historiTransaksi?sign="+voucher.sign);
                        }}
                      >
                        <Link href={`/historiTransaksi?sign=` + voucher.sign}>HistoryT</Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        asChild
                        variant="secondary"
                        onClick={() => {
                            router.push("/historiSaldo?sign="+voucher.sign);
                        }}
                      >
                        <Link href={`/historiSaldo?sign=` + voucher.sign}>HistoryS</Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          handleEditStatus(voucher._id, !voucher.status)
                        }
                      >
                        {voucher.status ? "Set False" : "Set True"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVoucher(voucher._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>{/* Pagination can be added here */}</TableFooter>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
