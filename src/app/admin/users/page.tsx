import prisma from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AllUsers from "@/components/admin/AllUsers";

async function getUsers() {
  try {
    const users = await prisma.user.findMany({});
    return users;
  } catch (err: any) {
    throw new Error(err);
  }
}

const AdminUsersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN") notFound();

  const users = await getUsers();

  return <AllUsers users={users} />;
};

export default AdminUsersPage;
