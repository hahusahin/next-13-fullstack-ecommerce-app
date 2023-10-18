import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface IParams {
  productId?: string;
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { productId } = params;

  if (!productId)
    return NextResponse.json({ message: "Product Not Found" }, { status: 404 });

  const body = await request.json();
  const { name, description, imageUrl, price, countInStock, category, brand } =
    body;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
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

  return NextResponse.json({ product: updatedProduct }, { status: 200 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: IParams }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { productId } = params;

  if (!productId)
    return NextResponse.json({ message: "Product Not Found" }, { status: 404 });

  await prisma.product.delete({
    where: { id: productId },
  });

  return NextResponse.json(
    { message: "Product deleted successfully" },
    { status: 200 }
  );
}
