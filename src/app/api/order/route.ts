import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { CartItem } from "@/store/cart-slice";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );

  const body: { cartItems: CartItem[]; totalPrice: number } =
    await request.json();

  const { cartItems, totalPrice } = body;

  const order = await prisma.order.create({
    data: {
      status: "pending",
      total: totalPrice,
      userId: currentUser.id,
    },
  });

  const orderItems = await prisma.orderItem.createMany({
    data: cartItems.map((item) => ({
      quantity: item.quantity,
      price: item.price,
      productId: item.id,
      orderId: order.id,
    })),
  });

  return NextResponse.json({ orderItems }, { status: 200 });
}
