import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface IParams {
  orderId?: string;
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { orderId } = params;

  if (!orderId)
    return NextResponse.json({ message: "Order Not Found" }, { status: 404 });

  const body = await request.json();
  const { isDelivered, deliveredAt } = body;

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      isDelivered,
      deliveredAt,
    },
  });

  return NextResponse.json({ order: updatedOrder }, { status: 200 });
}
