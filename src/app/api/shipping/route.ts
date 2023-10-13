import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ message: "User Not Found" }, { status: 400 });

  const body = await request.json();

  const { id, name, address, city, zipcode, country } = body;

  const data = {
    userId: session.user.id,
    name,
    address,
    city,
    country,
    zipcode,
  };

  const newAddress = id
    ? await prisma.shippingAddress.update({ where: { id }, data })
    : await prisma.shippingAddress.create({ data });

  return NextResponse.json(newAddress, { status: 200 });
}
