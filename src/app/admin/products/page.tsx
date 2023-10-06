import prisma from "@/lib/prismadb";
import AllProducts from "@/components/admin/AllProducts";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";

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
  const currentUser = await getCurrentUser();
  
  if (!currentUser || currentUser.role !== "ADMIN") redirect("/")

  const products = await getProducts();

  return <AllProducts products={products} />;
};

export default AdminProductsPage;
