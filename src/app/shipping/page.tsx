import prisma from "@/lib/prismadb";
import getCurrentUser from "../actions/getCurrentUser";
import Shipping from "@/components/order/Shipping";

async function getUserAddresses() {
  try {
    const currentUser = await getCurrentUser();
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
  const addresses = await getUserAddresses();

  if (!addresses) return <div>Not Found</div>;

  return <Shipping addresses={addresses} />;
};

export default ShippingPage;
