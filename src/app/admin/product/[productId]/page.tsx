import EditProduct from "@/components/admin/EditProduct";
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
    });

    if (!product) return null;

    return product;
  } catch (err: any) {
    throw new Error(err);
  }
}

const EditProductPage = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);

  if (!product) return notFound();

  return <EditProduct product={product} />;
};

export default EditProductPage;
