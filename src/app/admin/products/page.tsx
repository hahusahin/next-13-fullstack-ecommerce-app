import prisma from "@/lib/prismadb";
import AllProducts from "@/components/admin/AllProducts";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({});
    const typeSafeProducts = products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
    }));
    return typeSafeProducts;
  } catch (err: any) {
    throw new Error(err);
  }
}

const AdminProductsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN") notFound();

  const products = await getProducts();

  return <AllProducts products={products} />;
};

export default AdminProductsPage;
