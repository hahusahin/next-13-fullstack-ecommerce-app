import prisma from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AllOrders from "@/components/admin/AllOrders";

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
    });
    const typeSafeOrders = orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      deliveredAt: order.deliveredAt
        ? order.deliveredAt.toISOString()
        : undefined,
    }));
    return typeSafeOrders;
  } catch (err: any) {
    throw new Error(err);
  }
}

const AdminProductsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN") notFound();

  const orders = await getOrders();

  return <AllOrders orders={orders} />;
};

export default AdminProductsPage;
