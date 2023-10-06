import prisma from "@/lib/prismadb";
import getCurrentUser from "../actions/getCurrentUser";
import Shipping from "@/components/order/Shipping";
import { redirect } from "next/navigation";
import { SafeUser } from "@/types";

async function getUserAddresses(currentUser: SafeUser) {
  try {
    const addresses = await prisma.shippingAddress.findMany({
      where: { userId: currentUser?.id },
    });

    if (!addresses) return null;

    return addresses;
  } catch (err: any) {
    throw new Error(err);
  }
}

const ShippingPage = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login?callbackUrl=/shipping");

  const addresses = await getUserAddresses(user);

  if (!addresses) return <div>Not Found</div>;

  return <Shipping addresses={addresses} />;
};

export default ShippingPage;
