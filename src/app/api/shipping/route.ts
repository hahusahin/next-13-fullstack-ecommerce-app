import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );

  const body = await request.json();

  const { id, name, address, city, zipcode, country } = body;

  const data = {
    userId: currentUser.id,
    name,
    address,
    city,
    country,
    zipcode,
  };

  const newAddress = id
    ? await prisma.shippingAddress.update({ where: { id }, data })
    : await prisma.shippingAddress.create({ data });

  return NextResponse.json({ newAddress }, { status: 200 });
}
