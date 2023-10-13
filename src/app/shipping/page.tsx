import prisma from "@/lib/prismadb";
import Shipping from "@/components/order/Shipping";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function getUserAddresses(userId: string) {
  try {
    const addresses = await prisma.shippingAddress.findMany({
      where: { userId },
    });

    if (!addresses) return null;

    return addresses;
  } catch (err: any) {
    throw new Error(err);
  }
}

const ShippingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login?callbackUrl=/shipping");

  const addresses = await getUserAddresses(session.user.id);

  if (!addresses) return <div>Not Found</div>;

  return <Shipping addresses={addresses} />;
};

export default ShippingPage;
