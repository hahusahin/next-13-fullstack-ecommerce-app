"use client";

import { SafeOrder } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { IoClose } from "react-icons/io5";
import { DataTable } from "../DataTable";
import { useRouter } from "next/navigation";
import moment from "moment";

const AllOrders = ({ orders }: { orders: SafeOrder[] }) => {
  const router = useRouter();

  const columns: ColumnDef<SafeOrder>[] = [
    {
      accessorKey: "user.name",
      header: "Name",
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: (row) =>
        moment(row.getValue() as string).format("DD-MM-YYYY, HH-mm A"),
    },
    {
      accessorKey: "totalPrice",
      header: "Total",
    },
    {
      accessorKey: "isDelivered",
      header: "Delivered At",
      cell: (row) =>
        row.getValue() ? (
          <span>
            {moment(row.row.original.deliveredAt).format("DD-MM-YYYY, HH-mm A")}
          </span>
        ) : (
          <IoClose size={24} color="red" />
        ),
    },
    {
      accessorKey: "id",
      header: "",
      cell: (row) => (
        <Button
          type="button"
          variant="outline-dark"
          onClick={() => router.push(`/order/${row.getValue()}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6 mb-auto">
      <div className="flex justify-between">
        <p className="text-3xl font-bold mb-6">All Orders</p>
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
};

export default AllOrders;
