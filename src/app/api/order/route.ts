import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );

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
      userId: currentUser.id,
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
