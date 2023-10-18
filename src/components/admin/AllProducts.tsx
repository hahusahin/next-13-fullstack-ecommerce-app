"use client";

import { SafeProduct } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { IoPencilOutline, IoTrashBinOutline } from "react-icons/io5";
import { DataTable } from "../DataTable";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import ConfirmDialog from "../ConfirmDialog";
import { Loader2 } from "lucide-react";

interface ProductTableItem {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  countInStock: number;
}

const AllProducts = ({ products }: { products: SafeProduct[] }) => {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: deleteProduct, isLoading } = useMutation({
    mutationFn: async (productId: string) =>
      await axios.delete(`/api/admin/product/${productId}`),
    onSuccess: () => {
      toast({ title: "Product Deleted Successfully!" });
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

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
      cell: (row) => (
        <div className="flex gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/product/${row.getValue()}`)}
          >
            <IoPencilOutline size="18" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button type="button" variant="ghost" size="icon">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <IoTrashBinOutline size="18" />
              </Button>
            }
            name={row.row.original.name}
            onDelete={() => deleteProduct(row.getValue() as string)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between">
        <p className="text-3xl font-bold mb-6">All Products</p>
        <Button
          variant="outline-primary"
          onClick={() => router.push("/admin/addproduct")}
        >
          Add Product
        </Button>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default AllProducts;
