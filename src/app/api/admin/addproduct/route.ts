import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN")
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const body = await request.json();
  const { name, description, imageUrl, price, countInStock, category, brand } =
    body;

  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      countInStock,
      category,
      brand,
    },
  });

  return NextResponse.json({ product: newProduct }, { status: 200 });
}
