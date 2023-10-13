import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthenticated" }, { status: 400 });

  const data = await request.json();

  const {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    orderItems,
    shippingAddressId,
  } = data;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddressId,
      orderItems: {
        create: orderItems,
      },
    },
  });

  return NextResponse.json({ order }, { status: 200 });
}
