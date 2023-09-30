import prisma from "@/lib/prismadb";
import getCurrentUser from "../actions/getCurrentUser";
import Account from "@/components/account/Account";

async function getUserAccount() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      include: {
        orders: true,
        addresses: true
      },
    });

    if (!user) return null;

    const { hashedPassword, ...safeUser } = user;
    return {
      ...safeUser,
      createdAt: safeUser.createdAt.toISOString(),
      updatedAt: safeUser.updatedAt.toISOString(),
      orders: safeUser.orders.map((order) => ({
        ...order,
        date: order.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

const AccountPage = async () => {
  const user = await getUserAccount();

  if (!user) return <div>Not Found</div>;

  return <Account user={user} />;
};

export default AccountPage;
