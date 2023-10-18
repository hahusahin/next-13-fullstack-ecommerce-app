import OrderDetails from "@/components/order/OrderDetails";
import prisma from "@/lib/prismadb";
import { notFound } from "next/navigation";

interface IParams {
  orderId?: string;
}

async function getOrderById(params: IParams) {
  try {
    const { orderId } = params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        user: true,
        shippingAddress: true,
      },
    });

    if (!order) return null;

    return order;
  } catch (err: any) {
    throw new Error(err);
  }
}

const OrderDetailsPage = async ({ params }: { params: IParams }) => {
  const order = await getOrderById(params);

  if (!order) return notFound();

  return <OrderDetails order={order} />;
};

export default OrderDetailsPage;
