import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface IParams {
  userId?: string;
}

export async function DELETE(
  _request: Request,
  { params }: { params: IParams }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { userId } = params;

  if (!userId)
    return NextResponse.json({ message: "User Not Found" }, { status: 404 });

  await prisma.user.delete({
    where: { id: userId },
  });

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}
