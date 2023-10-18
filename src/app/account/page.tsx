import prisma from "@/lib/prismadb";
import Account from "@/components/account/Account";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

async function getUserAccount() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        orders: true,
        addresses: true,
      },
    });

    if (!user) return null;

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    const { hashedPassword, ...safeUser } = user;
    return {
      ...safeUser,
      createdAt: safeUser.createdAt.toISOString(),
      updatedAt: safeUser.updatedAt.toISOString(),
      orders: safeUser.orders.map((order) => ({
        ...order,
        date: order.createdAt.toISOString(),
      })),
      isSocialLogin: !!account,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

const AccountPage = async () => {
  const user = await getUserAccount();

  if (!user) redirect("/login?callbackUrl=/account");

  return <Account user={user} />;
};

export default AccountPage;
