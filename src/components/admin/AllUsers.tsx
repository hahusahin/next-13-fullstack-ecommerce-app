"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { IoPencilOutline, IoTrashBinOutline } from "react-icons/io5";
import { DataTable } from "../DataTable";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import ConfirmDialog from "../ConfirmDialog";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";
import Image from "next/image";

const AllUsers = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: deleteUser, isLoading } = useMutation({
    mutationFn: async (userId: string) =>
      await axios.delete(`/api/admin/user/${userId}`),
    onSuccess: () => {
      toast({ title: "User Deleted Successfully!" });
      router.refresh();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong!",
      });
    },
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) =>
        row.original.image && (
          <div className="w-8 h-8 relative">
            <Image
              fill
              src={row.original.image}
              alt="Profile"
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "id",
      header: "",
      cell: (row) => (
        <ConfirmDialog
          trigger={
            <Button type="button" variant="ghost" size="icon">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <IoTrashBinOutline size="18" />
            </Button>
          }
          name={row.row.original.name ?? ""}
          onDelete={() => deleteUser(row.getValue() as string)}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto py-6 mb-auto">
      <p className="text-3xl font-bold mb-6">All Users</p>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default AllUsers;
