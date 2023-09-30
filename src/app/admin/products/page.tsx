import prisma from "@/lib/prismadb";
import AllProducts from "@/components/admin/AllProducts";
import getCurrentUser from "@/app/actions/getCurrentUser";

async function getProducts() {
  try {
    const currentUser = await getCurrentUser();
    // if (currentUser?.role !== "ADMIN") throw new Error("Not Authorized");

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
  const products = await getProducts();

  return <AllProducts products={products} />;
};

export default AdminProductsPage;
