import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddProduct from "@/components/admin/AddProduct";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const AddProductPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN") notFound();

  return <AddProduct />;
};

export default AddProductPage;
