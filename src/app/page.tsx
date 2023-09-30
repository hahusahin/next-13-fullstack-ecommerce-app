import prisma from "@/lib/prismadb";
import ProductItem from "@/components/product/ProductItem";

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

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="h-full">
      <div
        className="
        container
        py-6
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        2xl:grid-cols-5
        gap-6
      "
      >
        {products.map((product) => (
          <ProductItem key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
}
