import ProductDetail from "@/components/product/ProductDetail";
import prisma from "@/libs/prismadb";

interface IParams {
  productId?: string;
}

async function getProductById(params: IParams) {
  try {
    const { productId } = params;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: true,
      },
    });

    if (!product) return null;

    return product;
  } catch (err: any) {
    throw new Error(err);
  }
}

const ProductPage = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);

  if (!product) return <div>Not Found</div>;

  return <ProductDetail product={product} />;
};

export default ProductPage;
