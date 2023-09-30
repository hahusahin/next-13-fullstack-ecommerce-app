"use client";

import { SafeProduct } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { IoPencilOutline, IoTrashBinOutline } from "react-icons/io5";
import { DataTable } from "../DataTable";
import Image from "next/image";

interface ProductTableItem {
  imageUrl: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  countInStock: number;
}

const AllProducts = ({ products }: { products: SafeProduct[] }) => {
  const columns: ColumnDef<ProductTableItem>[] = [
    {
      accessorKey: "imageUrl",
      header: "",
      cell: ({ row }) => (
        <div className="w-8 h-8 relative">
          <Image
            fill
            src={row.original.imageUrl}
            alt={row.original.name}
            style={{ objectFit: "contain" }}
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "countInStock",
      header: "Count In Stock",
    },
    {
      accessorKey: "id",
      header: "",
      cell: () => (
        <div className="flex gap-4">
          <Button type="button" variant="ghost" size="icon">
            <IoPencilOutline size="18" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <IoTrashBinOutline size="18" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <p className="text-3xl font-bold mb-6">All Products</p>
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default AllProducts;
