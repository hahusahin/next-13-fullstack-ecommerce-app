import { Order } from "@prisma/client";
import React from "react";
import { DataTable } from "../DataTable";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { IoClose } from "react-icons/io5";
import { Button } from "../ui/button";
import Link from "next/link";

const OrdersTable = ({ orders }: { orders: Order[] }) => {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        moment(row.original.createdAt).format("DD-MM-YYYY, HH-mm A"),
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      accessorKey: "isDelivered",
      header: "Delivered",
      cell: ({ row }) =>
        row.original.isDelivered ? (
          moment(row.original.deliveredAt).format("DD-MM-YYYY, HH-mm A")
        ) : (
          <IoClose color="red" size={20} />
        ),
    },
    {
      accessorKey: "userId",
      header: "",
      cell: ({ row }) => (
        <Link href={`/order/${row.original.id}`}>
          <Button variant="outline-primary">Details</Button>
        </Link>
      ),
    },
  ];

  return <DataTable columns={columns} data={orders} />;
};

export default OrdersTable;
