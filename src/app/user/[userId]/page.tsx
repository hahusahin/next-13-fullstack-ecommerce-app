import Profile from "@/components/user/Profile";
import prisma from "@/libs/prismadb";

interface IParams {
  userId?: string;
}

async function getUserById(params: IParams) {
  try {
    const { userId } = params;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        orders: true,
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
        date: order.date.toISOString(),
      })),
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

const ProfilePage = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params);

  if (!user) return <div>Not Found</div>;

  return <Profile user={user} />;
};

export default ProfilePage;
