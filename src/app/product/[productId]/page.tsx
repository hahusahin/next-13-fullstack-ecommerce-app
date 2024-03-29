import ProductDetail from "@/components/product/ProductDetail";
import prisma from "@/lib/prismadb";
import { notFound } from "next/navigation";

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
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!product) return null;

    return product;
  } catch (err: any) {
    throw new Error(err);
  }
}

export const generateMetadata = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);

  if (!product) return null;

  return { title: product.name, description: product.description };
};

const ProductPage = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);

  if (!product) return notFound();

  return <ProductDetail product={product} />;
};

export default ProductPage;
